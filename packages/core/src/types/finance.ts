export type TransactionType = "expense" | "income";

export type PaymentMethod =
  | "cash"
  | "card"
  | "transfer"
  | "mbway"
  | "direct_debit"
  | "other"
  | "";

export type CategoryGroup = {
  id: string;
  label: string;
  /** Grupo de despesas, receitas ou ambos. */
  kind: "expense" | "income" | "both";
  sortOrder: number;
};

export type FinanceCategory = {
  id: string;
  groupId: string;
  label: string;
  kind: TransactionType;
  sortOrder: number;
};

export type FinanceTransaction = {
  id: string;
  dateLocal: string;
  type: TransactionType;
  /** Valor positivo em cêntimos. */
  amountCents: number;
  categoryId: string;
  description: string;
  paymentMethod?: PaymentMethod;
  createdAt: string;
};

export type MonthlyBudgetLine = {
  categoryId: string;
  projectedCents: number;
};

export type MonthlyBudget = {
  year: number;
  month: number;
  lines: MonthlyBudgetLine[];
};

export type Allowance = {
  id: string;
  childName: string;
  weeklyAmountCents: number;
  balanceCents: number;
  updatedAt: string;
};

export type BalanceKind = "asset" | "liability";

export type BalanceItem = {
  id: string;
  description: string;
  category: string;
  kind: BalanceKind;
  startDateLocal: string;
  initialCents: number;
  currentCents: number;
  updatedAt: string;
};

export type Loan = {
  id: string;
  description: string;
  initialCents: number;
  termMonths: number;
  annualRatePercent: number;
  startDateLocal: string;
  balanceItemId?: string;
};

export type ShoppingItem = {
  id: string;
  description: string;
  maxSpendCents: number | null;
  month: number | null;
  year: number | null;
  done: boolean;
  createdAt: string;
};

/** @deprecated Orçamento semanal legado (v1). */
export type WeeklyBudget = {
  weekStart: string;
  limitCents: number;
};

export type FinanceStoreV1 = {
  version: 1;
  transactions: FinanceTransaction[];
  budget: WeeklyBudget | null;
  allowances: Allowance[];
};

export type FinanceStore = {
  version: 2;
  categoryGroups: CategoryGroup[];
  categories: FinanceCategory[];
  transactions: FinanceTransaction[];
  monthlyBudgets: MonthlyBudget[];
  allowances: Allowance[];
  balanceItems: BalanceItem[];
  loans: Loan[];
  shoppingList: ShoppingItem[];
};

export type MonthSummary = {
  year: number;
  month: number;
  incomeCents: number;
  expenseCents: number;
  cashFlowCents: number;
  assetsCents: number;
  liabilitiesCents: number;
};

export type YearSummary = {
  year: number;
  incomeCents: number;
  expenseCents: number;
  cashFlowCents: number;
};

export type BudgetLineSummary = {
  categoryId: string;
  categoryLabel: string;
  groupLabel: string;
  kind: TransactionType;
  projectedCents: number;
  actualCents: number;
  varianceCents: number;
};

export type MonthBudgetSummary = {
  year: number;
  month: number;
  income: BudgetLineSummary[];
  expense: BudgetLineSummary[];
  totalIncomeProjected: number;
  totalIncomeActual: number;
  totalExpenseProjected: number;
  totalExpenseActual: number;
};

export type WeekSummary = {
  weekStart: string;
  weekEnd: string;
  expenseCents: number;
  incomeCents: number;
  limitCents: number | null;
  remainingCents: number | null;
};

/** Mantido para compatibilidade com código antigo. */
export const DEFAULT_FINANCE_CATEGORIES: { id: string; label: string }[] = [];

export type ImportPreviewRow = {
  dateLocal: string;
  type: TransactionType;
  description: string;
  categoryLabel: string;
  amountCents: number;
  paymentMethod?: PaymentMethod;
};

export type ImportResult = {
  imported: number;
  skipped: number;
  createdCategories: string[];
};
