import { emptyFinanceStore } from "./finance-defaults";
import {
  parseCsvTransactions,
  parseOfxTransactions,
  parseSpreadsheetLedgerRows,
  resolveCategoryId,
  summarizeImport,
} from "./finance-import";
import {
  categoriesForType,
  computeMonthBudgetSummary,
  computeMonthSummary,
  computeWeekSummary,
  computeYearSummary,
  currentYearMonth,
  filterTransactionsByMonth,
  getCategoryById,
  getGroupLabel,
  newId,
  totalBalance,
  weekStartMonday,
} from "./finance-utils";
import { localDateKey } from "./checkin-storage";
import type {
  Allowance,
  BalanceItem,
  BalanceKind,
  CategoryGroup,
  FinanceCategory,
  FinanceStore,
  FinanceStoreV1,
  FinanceTransaction,
  ImportPreviewRow,
  ImportResult,
  Loan,
  MonthBudgetSummary,
  MonthSummary,
  MonthlyBudget,
  PaymentMethod,
  ShoppingItem,
  TransactionType,
  WeekSummary,
  YearSummary,
} from "./types/finance";

const STORAGE_KEY = "nucleo:v1:finance";

export type FinanceKeyValueStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

let storage: FinanceKeyValueStorage | null = null;

export function configureFinanceStorage(adapter: FinanceKeyValueStorage): void {
  storage = adapter;
}

export function createBrowserFinanceStorage(): FinanceKeyValueStorage | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return {
    getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key, value) => {
      window.localStorage.setItem(key, value);
      return Promise.resolve();
    },
  };
}

function getStorage(): FinanceKeyValueStorage | null {
  return storage ?? createBrowserFinanceStorage();
}

const LEGACY_CATEGORY_MAP: Record<string, string> = {
  casa: "cat-morada-arrendamento",
  alimentacao: "cat-morada-supermercado",
  escola: "cat-educacao-cursos-extras",
  saude: "cat-saude-farmacia",
  lazer: "cat-despesas-nao-essenciais-restaurantes-e-saidas",
  transporte: "cat-despesas-essenciais-transporte",
  outros: "cat-receitas-outras",
};

function migrateV1(raw: FinanceStoreV1): FinanceStore {
  const store = emptyFinanceStore();
  store.transactions = raw.transactions.map((t) => ({
    ...t,
    categoryId:
      LEGACY_CATEGORY_MAP[t.categoryId] ??
      (t.type === "income" ? "cat-receitas-outras" : "cat-despesas-nao-essenciais-despesas-gerais"),
    paymentMethod: t.paymentMethod ?? "",
  }));
  store.allowances = raw.allowances ?? [];
  if (raw.budget?.limitCents) {
    const { year, month } = currentYearMonth();
    store.monthlyBudgets.push({
      year,
      month,
      lines: [
        {
          categoryId: "cat-despesas-nao-essenciais-despesas-gerais",
          projectedCents: raw.budget.limitCents * 4,
        },
      ],
    });
  }
  return store;
}

function normalizeStore(parsed: unknown): FinanceStore {
  if (!parsed || typeof parsed !== "object") return emptyFinanceStore();
  const p = parsed as { version?: number };
  if (p.version === 1) return migrateV1(parsed as FinanceStoreV1);
  if (p.version !== 2) return emptyFinanceStore();
  const s = parsed as FinanceStore;
  const base = emptyFinanceStore();
  return {
    version: 2,
    categoryGroups: s.categoryGroups?.length ? s.categoryGroups : base.categoryGroups,
    categories: s.categories?.length ? s.categories : base.categories,
    transactions: s.transactions ?? [],
    monthlyBudgets: s.monthlyBudgets ?? [],
    allowances: s.allowances ?? [],
    balanceItems: s.balanceItems ?? [],
    loans: s.loans ?? [],
    shoppingList: s.shoppingList ?? [],
  };
}

export async function loadFinanceStore(): Promise<FinanceStore> {
  const s = getStorage();
  if (!s) return emptyFinanceStore();
  try {
    const raw = await s.getItem(STORAGE_KEY);
    if (!raw) return emptyFinanceStore();
    return normalizeStore(JSON.parse(raw));
  } catch {
    return emptyFinanceStore();
  }
}

async function saveFinanceStore(store: FinanceStore): Promise<void> {
  const s = getStorage();
  if (!s) return;
  await s.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ——— Transações ———

export async function addTransaction(input: {
  type: TransactionType;
  amountCents: number;
  categoryId: string;
  description: string;
  dateLocal?: string;
  paymentMethod?: PaymentMethod;
}): Promise<FinanceTransaction> {
  const store = await loadFinanceStore();
  const tx: FinanceTransaction = {
    id: newId("tx"),
    dateLocal: input.dateLocal ?? localDateKey(),
    type: input.type,
    amountCents: input.amountCents,
    categoryId: input.categoryId,
    description: input.description.trim(),
    paymentMethod: input.paymentMethod ?? "",
    createdAt: new Date().toISOString(),
  };
  store.transactions.unshift(tx);
  await saveFinanceStore(store);
  return tx;
}

export async function deleteTransaction(id: string): Promise<void> {
  const store = await loadFinanceStore();
  store.transactions = store.transactions.filter((t) => t.id !== id);
  await saveFinanceStore(store);
}

export async function listRecentTransactions(
  limit = 50,
): Promise<FinanceTransaction[]> {
  const store = await loadFinanceStore();
  return store.transactions.slice(0, limit);
}

export async function listTransactionsForMonth(
  year: number,
  month: number,
): Promise<FinanceTransaction[]> {
  const store = await loadFinanceStore();
  return filterTransactionsByMonth(store.transactions, year, month);
}

// ——— Categorias ———

export async function listCategoryGroups(): Promise<CategoryGroup[]> {
  const store = await loadFinanceStore();
  return [...store.categoryGroups].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function listCategories(
  type?: TransactionType,
): Promise<FinanceCategory[]> {
  const store = await loadFinanceStore();
  if (!type) return [...store.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  return categoriesForType(store, type);
}

export async function addCategory(input: {
  groupId: string;
  label: string;
  kind: TransactionType;
}): Promise<FinanceCategory> {
  const store = await loadFinanceStore();
  const id = newId("cat");
  const cat: FinanceCategory = {
    id,
    groupId: input.groupId,
    label: input.label.trim(),
    kind: input.kind,
    sortOrder: store.categories.length,
  };
  store.categories.push(cat);
  await saveFinanceStore(store);
  return cat;
}

export async function addCategoryGroup(input: {
  label: string;
  kind: CategoryGroup["kind"];
}): Promise<CategoryGroup> {
  const store = await loadFinanceStore();
  const group: CategoryGroup = {
    id: newId("grp"),
    label: input.label.trim(),
    kind: input.kind,
    sortOrder: store.categoryGroups.length,
  };
  store.categoryGroups.push(group);
  await saveFinanceStore(store);
  return group;
}

export async function ensureCategoryByLabel(
  label: string,
  type: TransactionType,
): Promise<FinanceCategory> {
  const store = await loadFinanceStore();
  const resolved = resolveCategoryId(store, label, type);
  if (!resolved.created) {
    const existing = getCategoryById(store, resolved.categoryId);
    if (existing) return existing;
  }
  const groupKind = type === "income" ? "income" : "expense";
  let group = store.categoryGroups.find(
    (g) => g.label === "Importadas" && g.kind === groupKind,
  );
  if (!group) {
    group = {
      id: newId("grp"),
      label: "Importadas",
      kind: groupKind,
      sortOrder: store.categoryGroups.length,
    };
    store.categoryGroups.push(group);
  }
  const cat: FinanceCategory = {
    id: newId("cat"),
    groupId: group.id,
    label: label.trim() || "Outras",
    kind: type,
    sortOrder: store.categories.length,
  };
  store.categories.push(cat);
  await saveFinanceStore(store);
  return cat;
}

// ——— Orçamento mensal ———

export async function setMonthlyBudgetLine(input: {
  year: number;
  month: number;
  categoryId: string;
  projectedCents: number;
}): Promise<void> {
  const store = await loadFinanceStore();
  let budget = store.monthlyBudgets.find(
    (b) => b.year === input.year && b.month === input.month,
  );
  if (!budget) {
    budget = { year: input.year, month: input.month, lines: [] };
    store.monthlyBudgets.push(budget);
  }
  const existing = budget.lines.find((l) => l.categoryId === input.categoryId);
  if (existing) existing.projectedCents = input.projectedCents;
  else
    budget.lines.push({
      categoryId: input.categoryId,
      projectedCents: input.projectedCents,
    });
  await saveFinanceStore(store);
}

export async function getMonthlyBudget(
  year: number,
  month: number,
): Promise<MonthlyBudget | null> {
  const store = await loadFinanceStore();
  return (
    store.monthlyBudgets.find((b) => b.year === year && b.month === month) ??
    null
  );
}

export async function getMonthBudgetSummary(
  year: number,
  month: number,
): Promise<MonthBudgetSummary> {
  const store = await loadFinanceStore();
  return computeMonthBudgetSummary(store, year, month);
}

// ——— Resumos ———

export async function getMonthSummary(
  year: number,
  month: number,
): Promise<MonthSummary> {
  const store = await loadFinanceStore();
  return computeMonthSummary(store, year, month);
}

export async function getYearSummary(year: number): Promise<YearSummary> {
  const store = await loadFinanceStore();
  return computeYearSummary(store.transactions, year);
}

/** @deprecated Usar orçamento mensal. Mantido para compatibilidade. */
export async function setWeeklyBudget(limitCents: number): Promise<void> {
  const { year, month } = currentYearMonth();
  await setMonthlyBudgetLine({
    year,
    month,
    categoryId: "cat-despesas-nao-essenciais-despesas-gerais",
    projectedCents: limitCents * 4,
  });
}

export async function getWeekSummaryForCurrentWeek(): Promise<WeekSummary> {
  const store = await loadFinanceStore();
  const weekStart = weekStartMonday();
  const { year, month } = currentYearMonth();
  const budget = store.monthlyBudgets.find(
    (b) => b.year === year && b.month === month,
  );
  const limit =
    budget?.lines.reduce((s, l) => s + l.projectedCents, 0) ?? null;
  const weeklyLimit =
    limit != null ? Math.round(limit / 4.33) : null;
  return computeWeekSummary(store.transactions, weekStart, weeklyLimit);
}

// ——— Balanço ———

export async function listBalanceItems(): Promise<BalanceItem[]> {
  const store = await loadFinanceStore();
  return store.balanceItems;
}

export async function addBalanceItem(input: {
  description: string;
  category: string;
  kind: BalanceKind;
  startDateLocal: string;
  initialCents: number;
  currentCents: number;
}): Promise<BalanceItem> {
  const store = await loadFinanceStore();
  const item: BalanceItem = {
    id: newId("bal"),
    ...input,
    updatedAt: new Date().toISOString(),
  };
  store.balanceItems.push(item);
  await saveFinanceStore(store);
  return item;
}

export async function updateBalanceItem(
  id: string,
  patch: Partial<Pick<BalanceItem, "currentCents" | "description" | "category">>,
): Promise<BalanceItem | null> {
  const store = await loadFinanceStore();
  const item = store.balanceItems.find((b) => b.id === id);
  if (!item) return null;
  Object.assign(item, patch, { updatedAt: new Date().toISOString() });
  await saveFinanceStore(store);
  return item;
}

export async function deleteBalanceItem(id: string): Promise<void> {
  const store = await loadFinanceStore();
  store.balanceItems = store.balanceItems.filter((b) => b.id !== id);
  await saveFinanceStore(store);
}

export async function getTotalBalance(): Promise<{
  assets: number;
  liabilities: number;
  net: number;
}> {
  const store = await loadFinanceStore();
  return totalBalance(store);
}

// ——— Empréstimos ———

export async function listLoans(): Promise<Loan[]> {
  const store = await loadFinanceStore();
  return store.loans;
}

export async function addLoan(input: {
  description: string;
  initialCents: number;
  termMonths: number;
  annualRatePercent: number;
  startDateLocal: string;
  linkLiability?: boolean;
}): Promise<Loan> {
  const store = await loadFinanceStore();
  const loan: Loan = {
    id: newId("loan"),
    description: input.description.trim(),
    initialCents: input.initialCents,
    termMonths: input.termMonths,
    annualRatePercent: input.annualRatePercent,
    startDateLocal: input.startDateLocal,
  };
  if (input.linkLiability) {
    const liability: BalanceItem = {
      id: newId("bal"),
      description: input.description.trim(),
      category: "PASSIVO",
      kind: "liability",
      startDateLocal: input.startDateLocal,
      initialCents: input.initialCents,
      currentCents: input.initialCents,
      updatedAt: new Date().toISOString(),
    };
    store.balanceItems.push(liability);
    loan.balanceItemId = liability.id;
  }
  store.loans.push(loan);
  await saveFinanceStore(store);
  return loan;
}

export async function deleteLoan(id: string): Promise<void> {
  const store = await loadFinanceStore();
  const loan = store.loans.find((l) => l.id === id);
  if (loan?.balanceItemId) {
    store.balanceItems = store.balanceItems.filter(
      (b) => b.id !== loan.balanceItemId,
    );
  }
  store.loans = store.loans.filter((l) => l.id !== id);
  await saveFinanceStore(store);
}

// ——— Lista de compras ———

export async function listShoppingItems(): Promise<ShoppingItem[]> {
  const store = await loadFinanceStore();
  return store.shoppingList;
}

export async function addShoppingItem(input: {
  description: string;
  maxSpendCents?: number | null;
  month?: number | null;
  year?: number | null;
}): Promise<ShoppingItem> {
  const store = await loadFinanceStore();
  const item: ShoppingItem = {
    id: newId("shop"),
    description: input.description.trim(),
    maxSpendCents: input.maxSpendCents ?? null,
    month: input.month ?? null,
    year: input.year ?? null,
    done: false,
    createdAt: new Date().toISOString(),
  };
  store.shoppingList.push(item);
  await saveFinanceStore(store);
  return item;
}

export async function toggleShoppingItem(id: string): Promise<void> {
  const store = await loadFinanceStore();
  const item = store.shoppingList.find((s) => s.id === id);
  if (item) item.done = !item.done;
  await saveFinanceStore(store);
}

export async function deleteShoppingItem(id: string): Promise<void> {
  const store = await loadFinanceStore();
  store.shoppingList = store.shoppingList.filter((s) => s.id !== id);
  await saveFinanceStore(store);
}

// ——— Mesadas ———

export async function addAllowance(input: {
  childName: string;
  weeklyAmountCents: number;
}): Promise<Allowance> {
  const store = await loadFinanceStore();
  const allowance: Allowance = {
    id: newId("allow"),
    childName: input.childName.trim(),
    weeklyAmountCents: input.weeklyAmountCents,
    balanceCents: 0,
    updatedAt: new Date().toISOString(),
  };
  store.allowances.push(allowance);
  await saveFinanceStore(store);
  return allowance;
}

export async function creditAllowance(id: string): Promise<Allowance | null> {
  const store = await loadFinanceStore();
  const item = store.allowances.find((a) => a.id === id);
  if (!item) return null;
  item.balanceCents += item.weeklyAmountCents;
  item.updatedAt = new Date().toISOString();
  await saveFinanceStore(store);
  return item;
}

export async function listAllowances(): Promise<Allowance[]> {
  const store = await loadFinanceStore();
  return store.allowances;
}

// ——— Importação ———

export async function previewImportFromText(
  text: string,
  format: "csv" | "ofx",
): Promise<ImportPreviewRow[]> {
  return format === "ofx"
    ? parseOfxTransactions(text)
    : parseCsvTransactions(text);
}

export async function previewImportFromSpreadsheetRows(
  matrix: unknown[][],
): Promise<ImportPreviewRow[]> {
  return parseSpreadsheetLedgerRows(matrix);
}

export async function commitImport(
  rows: ImportPreviewRow[],
): Promise<ImportResult> {
  const store = await loadFinanceStore();
  const createdCategories: string[] = [];

  for (const row of rows) {
    const resolved = resolveCategoryId(store, row.categoryLabel, row.type);
    let categoryId = resolved.categoryId;
    if (resolved.created || !categoryId) {
      const groupKind = row.type === "income" ? "income" : "expense";
      let group = store.categoryGroups.find(
        (g) => g.label === "Importadas" && g.kind === groupKind,
      );
      if (!group) {
        group = {
          id: newId("grp"),
          label: "Importadas",
          kind: groupKind,
          sortOrder: store.categoryGroups.length,
        };
        store.categoryGroups.push(group);
      }
      const cat: FinanceCategory = {
        id: newId("cat"),
        groupId: group.id,
        label: row.categoryLabel.trim() || "Outras",
        kind: row.type,
        sortOrder: store.categories.length,
      };
      store.categories.push(cat);
      categoryId = cat.id;
      createdCategories.push(cat.label);
    }
    store.transactions.unshift({
      id: newId("tx"),
      dateLocal: row.dateLocal,
      type: row.type,
      amountCents: row.amountCents,
      categoryId,
      description: row.description,
      paymentMethod: row.paymentMethod ?? "",
      createdAt: new Date().toISOString(),
    });
  }

  await saveFinanceStore(store);
  return summarizeImport(rows.length, createdCategories);
}

// ——— Helpers exportados para UI ———

export { getCategoryById, getGroupLabel, currentYearMonth };
