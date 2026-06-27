import type {
  BudgetLineSummary,
  FinanceCategory,
  FinanceStore,
  FinanceTransaction,
  MonthBudgetSummary,
  MonthSummary,
  TransactionType,
  WeekSummary,
  YearSummary,
} from "./types/finance";
import { localDateKey } from "./checkin-storage";

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function parseMonthKey(key: string): { year: number; month: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(key);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

export function currentYearMonth(): { year: number; month: number } {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export function dateInMonth(dateLocal: string, year: number, month: number): boolean {
  const [y, m] = dateLocal.split("-").map(Number);
  return y === year && m === month;
}

export function dateInYear(dateLocal: string, year: number): boolean {
  return Number(dateLocal.slice(0, 4)) === year;
}

/** Segunda-feira da semana de `d` (local). */
export function weekStartMonday(d = new Date()): string {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return localDateKey(copy);
}

export function weekEndSunday(weekStart: string): string {
  const [y, m, d] = weekStart.split("-").map(Number);
  const end = new Date(y, m - 1, d + 6);
  return localDateKey(end);
}

export function isDateInWeek(dateLocal: string, weekStart: string): boolean {
  const end = weekEndSunday(weekStart);
  return dateLocal >= weekStart && dateLocal <= end;
}

export function parseEuroInput(value: string): number | null {
  const normalized = value
    .trim()
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export function parseEuroFromSpreadsheet(value: string): number | null {
  const normalized = value
    .trim()
    .replace(/€/g, "")
    .replace(/\s/g, "")
    .replace(/,/g, "");
  if (!normalized) return null;
  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;
  return Math.round(Math.abs(n) * 100);
}

export function formatEuroCents(
  cents: number,
  locale: string = "pt-PT",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function parseDateLocal(input: string): string | null {
  if (!input) return null;
  const s = input.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // dd/mm/yyyy or dd-mm-yyyy or dd.mm.yyyy
  const dmY = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(s);
  if (dmY) {
    const d = Number(dmY[1]);
    const m = Number(dmY[2]);
    const y = Number(dmY[3]);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }
  // mm/dd/yyyy (US format — only if month > 12 in first position is impossible)
  const mdY = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(s);
  if (mdY) {
    const m = Number(mdY[1]);
    const d = Number(mdY[2]);
    const y = Number(mdY[3]);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31 && m > 12) {
      return `${y}-${String(d).padStart(2, "0")}-${String(m).padStart(2, "0")}`;
    }
  }
  // dd/mm/yy
  const dmYshort = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2})$/.exec(s);
  if (dmYshort) {
    const d = Number(dmYshort[1]);
    const m = Number(dmYshort[2]);
    const y = 2000 + Number(dmYshort[3]);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }
  // yyyymmdd (OFX/bank format)
  if (/^\d{8}$/.test(s)) {
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }
  // JS Date object from XLSX
  const d = new Date(s);
  if (!isNaN(d.getTime()) && d.getFullYear() > 1990) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  return null;
}

export function computeWeekSummary(
  transactions: FinanceTransaction[],
  weekStart: string,
  limitCents: number | null,
): WeekSummary {
  let expenseCents = 0;
  let incomeCents = 0;
  for (const t of transactions) {
    if (!isDateInWeek(t.dateLocal, weekStart)) continue;
    if (t.type === "expense") expenseCents += t.amountCents;
    else incomeCents += t.amountCents;
  }
  const remainingCents =
    limitCents != null ? limitCents - expenseCents : null;
  return {
    weekStart,
    weekEnd: weekEndSunday(weekStart),
    expenseCents,
    incomeCents,
    limitCents,
    remainingCents,
  };
}

export function sumTransactionsForMonth(
  transactions: FinanceTransaction[],
  year: number,
  month: number,
  type?: TransactionType,
): number {
  let total = 0;
  for (const t of transactions) {
    if (!dateInMonth(t.dateLocal, year, month)) continue;
    if (type && t.type !== type) continue;
    total += t.amountCents;
  }
  return total;
}

export function computeMonthSummary(
  store: FinanceStore,
  year: number,
  month: number,
): MonthSummary {
  const incomeCents = sumTransactionsForMonth(
    store.transactions,
    year,
    month,
    "income",
  );
  const expenseCents = sumTransactionsForMonth(
    store.transactions,
    year,
    month,
    "expense",
  );
  let assetsCents = 0;
  let liabilitiesCents = 0;
  for (const b of store.balanceItems) {
    if (b.kind === "asset") assetsCents += b.currentCents;
    else liabilitiesCents += b.currentCents;
  }
  return {
    year,
    month,
    incomeCents,
    expenseCents,
    cashFlowCents: incomeCents - expenseCents,
    assetsCents,
    liabilitiesCents,
  };
}

export function computeYearSummary(
  transactions: FinanceTransaction[],
  year: number,
): YearSummary {
  let incomeCents = 0;
  let expenseCents = 0;
  for (const t of transactions) {
    if (!dateInYear(t.dateLocal, year)) continue;
    if (t.type === "income") incomeCents += t.amountCents;
    else expenseCents += t.amountCents;
  }
  return {
    year,
    incomeCents,
    expenseCents,
    cashFlowCents: incomeCents - expenseCents,
  };
}

export function getCategoryById(
  store: FinanceStore,
  id: string,
): FinanceCategory | undefined {
  return store.categories.find((c) => c.id === id);
}

export function getGroupLabel(store: FinanceStore, categoryId: string): string {
  const cat = getCategoryById(store, categoryId);
  if (!cat) return "";
  return (
    store.categoryGroups.find((g) => g.id === cat.groupId)?.label ?? ""
  );
}

export function categoriesForType(
  store: FinanceStore,
  type: TransactionType,
): FinanceCategory[] {
  return store.categories
    .filter((c) => c.kind === type)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function computeMonthBudgetSummary(
  store: FinanceStore,
  year: number,
  month: number,
): MonthBudgetSummary {
  const budget = store.monthlyBudgets.find(
    (b) => b.year === year && b.month === month,
  );
  const projected = new Map<string, number>();
  for (const line of budget?.lines ?? []) {
    projected.set(line.categoryId, line.projectedCents);
  }

  const actualByCategory = new Map<string, number>();
  for (const t of store.transactions) {
    if (!dateInMonth(t.dateLocal, year, month)) continue;
    const prev = actualByCategory.get(t.categoryId) ?? 0;
    actualByCategory.set(t.categoryId, prev + t.amountCents);
  }

  const categoryIds = new Set<string>([
    ...projected.keys(),
    ...actualByCategory.keys(),
  ]);

  const income: BudgetLineSummary[] = [];
  const expense: BudgetLineSummary[] = [];

  for (const categoryId of categoryIds) {
    const cat = getCategoryById(store, categoryId);
    if (!cat) continue;
    const line: BudgetLineSummary = {
      categoryId,
      categoryLabel: cat.label,
      groupLabel: getGroupLabel(store, categoryId),
      kind: cat.kind,
      projectedCents: projected.get(categoryId) ?? 0,
      actualCents: actualByCategory.get(categoryId) ?? 0,
      varianceCents:
        (actualByCategory.get(categoryId) ?? 0) -
        (projected.get(categoryId) ?? 0),
    };
    if (cat.kind === "income") income.push(line);
    else expense.push(line);
  }

  income.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel, "pt"));
  expense.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel, "pt"));

  const sum = (lines: BudgetLineSummary[], field: "projectedCents" | "actualCents") =>
    lines.reduce((acc, l) => acc + l[field], 0);

  return {
    year,
    month,
    income,
    expense,
    totalIncomeProjected: sum(income, "projectedCents"),
    totalIncomeActual: sum(income, "actualCents"),
    totalExpenseProjected: sum(expense, "projectedCents"),
    totalExpenseActual: sum(expense, "actualCents"),
  };
}

export function filterTransactionsByMonth(
  transactions: FinanceTransaction[],
  year: number,
  month: number,
): FinanceTransaction[] {
  return transactions.filter((t) => dateInMonth(t.dateLocal, year, month));
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function totalBalance(store: FinanceStore): {
  assets: number;
  liabilities: number;
  net: number;
} {
  let assets = 0;
  let liabilities = 0;
  for (const b of store.balanceItems) {
    if (b.kind === "asset") assets += b.currentCents;
    else liabilities += b.currentCents;
  }
  return { assets, liabilities, net: assets - liabilities };
}
