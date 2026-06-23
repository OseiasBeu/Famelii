"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addAllowance,
  addBalanceItem,
  addCategory,
  addCategoryGroup,
  addLoan,
  addShoppingItem,
  addTransaction,
  commitImport,
  creditAllowance,
  currentYearMonth,
  deleteBalanceItem,
  deleteLoan,
  deleteShoppingItem,
  deleteTransaction,
  formatEuroCents,
  getMonthBudgetSummary,
  getMonthSummary,
  getTotalBalance,
  getYearSummary,
  listAllowances,
  listBalanceItems,
  listCategories,
  listCategoryGroups,
  listLoans,
  listShoppingItems,
  listTransactionsForMonth,
  localDateKey,
  parseEuroInput,
  previewImportFromSpreadsheetRows,
  previewImportFromText,
  setMonthlyBudgetLine,
  toggleShoppingItem,
  type Allowance,
  type BalanceItem,
  type FinanceCategory,
  type FinanceTransaction,
  type ImportPreviewRow,
  type Loan,
  type MonthBudgetSummary,
  type MonthSummary,
  type PaymentMethod,
  type ShoppingItem,
  type TransactionType,
  type YearSummary,
} from "@famelii/core";

const TABS = [
  { id: "resumo", label: "Resumo" },
  { id: "movimentos", label: "Movimentos" },
  { id: "orcamento", label: "Orçamento" },
  { id: "categorias", label: "Categorias" },
  { id: "balanco", label: "Balanço" },
  { id: "emprestimos", label: "Empréstimos" },
  { id: "compras", label: "Compras" },
  { id: "mesada", label: "Mesada" },
  { id: "importar", label: "Importar" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "", label: "—" },
  { value: "card", label: "Cartão" },
  { value: "cash", label: "Dinheiro" },
  { value: "transfer", label: "Transferência" },
  { value: "mbway", label: "MB Way" },
  { value: "direct_debit", label: "Débito direto" },
  { value: "other", label: "Outro" },
];

function cardClass() {
  return "rounded-2xl border border-black/10 bg-white/70 p-5 dark:border-white/15 dark:bg-white/5";
}

function inputClass() {
  return "rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black/30";
}

function btnPrimary() {
  return "rounded-full bg-[var(--nu-ink)] px-4 py-2 text-sm font-medium text-[var(--nu-bg)]";
}

function btnGhost() {
  return "text-xs text-[var(--nu-muted)] underline";
}

function moneyColor(cents: number) {
  return cents < 0 ? "text-red-700" : "text-green-800";
}

export function FinanceMvpPanel() {
  const now = currentYearMonth();
  const [tab, setTab] = useState<TabId>("resumo");
  const [ready, setReady] = useState(false);
  const [year, setYear] = useState(now.year);
  const [month, setMonth] = useState(now.month);

  const [monthSummary, setMonthSummary] = useState<MonthSummary | null>(null);
  const [yearSummary, setYearSummary] = useState<YearSummary | null>(null);
  const [budgetSummary, setBudgetSummary] = useState<MonthBudgetSummary | null>(null);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [groups, setGroups] = useState<Awaited<ReturnType<typeof listCategoryGroups>>>([]);
  const [balanceItems, setBalanceItems] = useState<BalanceItem[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [shopping, setShopping] = useState<ShoppingItem[]>([]);
  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [totals, setTotals] = useState({ assets: 0, liabilities: 0, net: 0 });

  const [txType, setTxType] = useState<TransactionType>("expense");
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState("");
  const [txDescription, setTxDescription] = useState("");
  const [txDate, setTxDate] = useState(localDateKey());
  const [txPayment, setTxPayment] = useState<PaymentMethod>("");

  const [budgetCat, setBudgetCat] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");

  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatGroup, setNewCatGroup] = useState("");
  const [newCatKind, setNewCatKind] = useState<TransactionType>("expense");
  const [newGroupLabel, setNewGroupLabel] = useState("");

  const [balDesc, setBalDesc] = useState("");
  const [balKind, setBalKind] = useState<"asset" | "liability">("asset");
  const [balInitial, setBalInitial] = useState("");
  const [balCurrent, setBalCurrent] = useState("");

  const [loanDesc, setLoanDesc] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState("120");
  const [loanRate, setLoanRate] = useState("5.5");

  const [shopDesc, setShopDesc] = useState("");
  const [shopMax, setShopMax] = useState("");

  const [childName, setChildName] = useState("");
  const [weeklyAllowance, setWeeklyAllowance] = useState("");

  const [importPreview, setImportPreview] = useState<ImportPreviewRow[]>([]);
  const [importMsg, setImportMsg] = useState("");

  const catsForType = useMemo(
    () => categories.filter((c) => c.kind === txType),
    [categories, txType],
  );

  const categoryLabel = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.label ?? id,
    [categories],
  );

  const refresh = useCallback(async () => {
    const [
      ms, ys, bs, txs, cats, grps, bal, ln, shop, all, tot,
    ] = await Promise.all([
      getMonthSummary(year, month),
      getYearSummary(year),
      getMonthBudgetSummary(year, month),
      listTransactionsForMonth(year, month),
      listCategories(),
      listCategoryGroups(),
      listBalanceItems(),
      listLoans(),
      listShoppingItems(),
      listAllowances(),
      getTotalBalance(),
    ]);
    setMonthSummary(ms);
    setYearSummary(ys);
    setBudgetSummary(bs);
    setTransactions(txs);
    setCategories(cats);
    setGroups(grps);
    setBalanceItems(bal);
    setLoans(ln);
    setShopping(shop);
    setAllowances(all);
    setTotals(tot);
    if (!txCategory && cats.length) {
      const exp = cats.find((c) => c.kind === "expense");
      if (exp) setTxCategory(exp.id);
    }
    if (!budgetCat && cats.length) {
      const exp = cats.find((c) => c.kind === "expense");
      if (exp) setBudgetCat(exp.id);
    }
    if (!newCatGroup && grps.length) setNewCatGroup(grps[0].id);
  }, [year, month, txCategory, budgetCat, newCatGroup]);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, [refresh]);

  useEffect(() => {
    const exp = categories.find((c) => c.kind === txType);
    if (exp) setTxCategory(exp.id);
  }, [txType, categories]);

  async function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault();
    const cents = parseEuroInput(txAmount);
    if (cents == null || cents <= 0 || !txCategory) return;
    await addTransaction({
      type: txType,
      amountCents: cents,
      categoryId: txCategory,
      description: txDescription || (txType === "expense" ? "Despesa" : "Receita"),
      dateLocal: txDate,
      paymentMethod: txPayment,
    });
    setTxAmount("");
    setTxDescription("");
    await refresh();
  }

  async function handleFileImport(file: File) {
    setImportMsg("");
    const name = file.name.toLowerCase();
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array", cellDates: true });
      const sheet =
        wb.Sheets["Entradas e Saídas"] ??
        wb.Sheets[wb.SheetNames.find((n) => n.includes("Entradas")) ?? ""];
      if (!sheet) {
        setImportMsg("Aba «Entradas e Saídas» não encontrada.");
        return;
      }
      const matrix = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
      }) as unknown[][];
      const preview = await previewImportFromSpreadsheetRows(matrix);
      setImportPreview(preview);
      setImportMsg(`${preview.length} movimentos prontos para importar.`);
      return;
    }
    const text = await file.text();
    const format = name.endsWith(".ofx") ? "ofx" : "csv";
    const preview = await previewImportFromText(text, format);
    setImportPreview(preview);
    setImportMsg(`${preview.length} movimentos prontos para importar.`);
  }

  if (!ready) {
    return <p className="text-sm text-[var(--nu-muted)]">A carregar finanças…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-[var(--nu-muted)]">
        Modo tutor · dados neste dispositivo até ligar Supabase.
      </p>

      <div className="flex flex-wrap gap-2">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className={inputClass()}
        >
          {[year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className={inputClass()}
        >
          {MONTHS.map((label, i) => (
            <option key={label} value={i + 1}>{label}</option>
          ))}
        </select>
      </div>

      <nav className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              tab === t.id
                ? "bg-[var(--nu-ink)] text-[var(--nu-bg)]"
                : "border border-black/15 text-[var(--nu-muted)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "resumo" && monthSummary && (
        <section className={cardClass()}>
          <h2 className="font-medium text-[var(--nu-ink)]">
            {MONTHS[month - 1]} {year}
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[var(--nu-muted)]">Renda</dt>
              <dd className="font-semibold text-green-800">
                {formatEuroCents(monthSummary.incomeCents)}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--nu-muted)]">Despesas</dt>
              <dd className="font-semibold text-red-800">
                {formatEuroCents(monthSummary.expenseCents)}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--nu-muted)]">Fluxo de caixa</dt>
              <dd className={`font-semibold ${moneyColor(monthSummary.cashFlowCents)}`}>
                {formatEuroCents(monthSummary.cashFlowCents)}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--nu-muted)]">Ativos</dt>
              <dd className="font-semibold">{formatEuroCents(totals.assets)}</dd>
            </div>
            <div>
              <dt className="text-[var(--nu-muted)]">Passivos</dt>
              <dd className="font-semibold">{formatEuroCents(totals.liabilities)}</dd>
            </div>
            <div>
              <dt className="text-[var(--nu-muted)]">Património líquido</dt>
              <dd className={`font-semibold ${moneyColor(totals.net)}`}>
                {formatEuroCents(totals.net)}
              </dd>
            </div>
          </dl>
          {yearSummary && (
            <p className="mt-4 text-sm text-[var(--nu-muted)]">
              Ano {year}: renda {formatEuroCents(yearSummary.incomeCents)} · despesas{" "}
              {formatEuroCents(yearSummary.expenseCents)} · fluxo{" "}
              <span className={moneyColor(yearSummary.cashFlowCents)}>
                {formatEuroCents(yearSummary.cashFlowCents)}
              </span>
            </p>
          )}
        </section>
      )}

      {tab === "movimentos" && (
        <>
          <section className={cardClass()}>
            <h2 className="font-medium text-[var(--nu-ink)]">Registar movimento</h2>
            <form onSubmit={handleAddTransaction} className="mt-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTxType(t)}
                    className={`rounded-full px-4 py-1.5 text-sm ${
                      txType === t
                        ? "bg-[var(--nu-ink)] text-[var(--nu-bg)]"
                        : "border border-black/15 text-[var(--nu-muted)]"
                    }`}
                  >
                    {t === "expense" ? "Saída" : "Entrada"}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} className={inputClass()} required />
                <input type="text" inputMode="decimal" placeholder="Valor (€)" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} required className={inputClass()} />
                <select value={txCategory} onChange={(e) => setTxCategory(e.target.value)} className={inputClass()}>
                  {catsForType.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
                <select value={txPayment} onChange={(e) => setTxPayment(e.target.value as PaymentMethod)} className={inputClass()}>
                  {PAYMENT_METHODS.map((p) => (
                    <option key={p.value || "none"} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <input type="text" placeholder="Descrição" value={txDescription} onChange={(e) => setTxDescription(e.target.value)} className={inputClass()} />
              <button type="submit" className={`${btnPrimary()} w-fit`}>Guardar</button>
            </form>
          </section>
          <section>
            <h2 className="font-medium text-[var(--nu-ink)]">
              Movimentos — {MONTHS[month - 1]} {year}
            </h2>
            {transactions.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--nu-muted)]">Sem registos neste mês.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {transactions.map((tx) => (
                  <li key={tx.id} className={`flex items-center justify-between gap-3 ${cardClass()} !p-3 text-sm`}>
                    <div>
                      <p className="font-medium text-[var(--nu-ink)]">
                        {tx.description} <span className="text-[var(--nu-muted)]">{tx.dateLocal}</span>
                      </p>
                      <p className="text-xs text-[var(--nu-muted)]">
                        {categoryLabel(tx.categoryId)} · {tx.type === "expense" ? "Saída" : "Entrada"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={tx.type === "expense" ? "text-red-800" : "text-green-800"}>
                        {tx.type === "expense" ? "−" : "+"}{formatEuroCents(tx.amountCents)}
                      </span>
                      <button type="button" onClick={() => deleteTransaction(tx.id).then(refresh)} className={btnGhost()}>Apagar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {tab === "orcamento" && budgetSummary && (
        <section className={cardClass()}>
          <h2 className="font-medium text-[var(--nu-ink)]">Orçamento — projetado vs realizado</h2>
          <form
            className="mt-4 flex flex-wrap gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const cents = parseEuroInput(budgetAmount);
              if (cents == null || !budgetCat) return;
              await setMonthlyBudgetLine({ year, month, categoryId: budgetCat, projectedCents: cents });
              setBudgetAmount("");
              await refresh();
            }}
          >
            <select value={budgetCat} onChange={(e) => setBudgetCat(e.target.value)} className={inputClass()}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label} ({c.kind === "income" ? "entrada" : "saída"})</option>
              ))}
            </select>
            <input type="text" inputMode="decimal" placeholder="Projetado (€)" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} className={inputClass()} />
            <button type="submit" className={btnPrimary()}>Definir linha</button>
          </form>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[var(--nu-muted)]">
                  <th className="pb-2 pr-4">Categoria</th>
                  <th className="pb-2 pr-4">Projetado</th>
                  <th className="pb-2 pr-4">Realizado</th>
                  <th className="pb-2">Diferença</th>
                </tr>
              </thead>
              <tbody>
                {[...budgetSummary.income, ...budgetSummary.expense].map((line) => (
                  <tr key={line.categoryId} className="border-t border-black/5">
                    <td className="py-2 pr-4">
                      <span className="font-medium">{line.categoryLabel}</span>
                      <span className="ml-1 text-xs text-[var(--nu-muted)]">{line.groupLabel}</span>
                    </td>
                    <td className="py-2 pr-4">{formatEuroCents(line.projectedCents)}</td>
                    <td className="py-2 pr-4">{formatEuroCents(line.actualCents)}</td>
                    <td className={`py-2 ${moneyColor(-line.varianceCents)}`}>
                      {formatEuroCents(line.varianceCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-black/10 font-medium">
                  <td className="pt-3">Receitas</td>
                  <td>{formatEuroCents(budgetSummary.totalIncomeProjected)}</td>
                  <td>{formatEuroCents(budgetSummary.totalIncomeActual)}</td>
                  <td />
                </tr>
                <tr className="font-medium">
                  <td className="pt-1">Despesas</td>
                  <td>{formatEuroCents(budgetSummary.totalExpenseProjected)}</td>
                  <td>{formatEuroCents(budgetSummary.totalExpenseActual)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      )}

      {tab === "categorias" && (
        <section className={cardClass()}>
          <h2 className="font-medium text-[var(--nu-ink)]">Categorias</h2>
          <form
            className="mt-4 flex flex-wrap gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newGroupLabel.trim()) return;
              await addCategoryGroup({ label: newGroupLabel, kind: newCatKind === "income" ? "income" : "expense" });
              setNewGroupLabel("");
              await refresh();
            }}
          >
            <input placeholder="Novo grupo" value={newGroupLabel} onChange={(e) => setNewGroupLabel(e.target.value)} className={inputClass()} />
            <button type="submit" className={btnPrimary()}>Grupo</button>
          </form>
          <form
            className="mt-3 flex flex-wrap gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newCatLabel.trim() || !newCatGroup) return;
              await addCategory({ groupId: newCatGroup, label: newCatLabel, kind: newCatKind });
              setNewCatLabel("");
              await refresh();
            }}
          >
            <input placeholder="Nova categoria" value={newCatLabel} onChange={(e) => setNewCatLabel(e.target.value)} className={inputClass()} />
            <select value={newCatGroup} onChange={(e) => setNewCatGroup(e.target.value)} className={inputClass()}>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
            <select value={newCatKind} onChange={(e) => setNewCatKind(e.target.value as TransactionType)} className={inputClass()}>
              <option value="expense">Saída</option>
              <option value="income">Entrada</option>
            </select>
            <button type="submit" className={btnPrimary()}>Categoria</button>
          </form>
          <ul className="mt-6 space-y-3 text-sm">
            {groups.map((g) => (
              <li key={g.id}>
                <p className="font-medium text-[var(--nu-ink)]">{g.label}</p>
                <ul className="ml-3 mt-1 text-[var(--nu-muted)]">
                  {categories.filter((c) => c.groupId === g.id).map((c) => (
                    <li key={c.id}>· {c.label} ({c.kind === "income" ? "entrada" : "saída"})</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "balanco" && (
        <section className={cardClass()}>
          <h2 className="font-medium text-[var(--nu-ink)]">Balanço patrimonial</h2>
          <form
            className="mt-4 grid gap-2 sm:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const initial = parseEuroInput(balInitial);
              const current = parseEuroInput(balCurrent) ?? initial;
              if (!balDesc.trim() || initial == null) return;
              await addBalanceItem({
                description: balDesc,
                category: balKind === "asset" ? "ATIVO" : "PASSIVO",
                kind: balKind,
                startDateLocal: localDateKey(),
                initialCents: initial,
                currentCents: current ?? initial,
              });
              setBalDesc(""); setBalInitial(""); setBalCurrent("");
              await refresh();
            }}
          >
            <input placeholder="Descrição" value={balDesc} onChange={(e) => setBalDesc(e.target.value)} className={inputClass()} />
            <select value={balKind} onChange={(e) => setBalKind(e.target.value as "asset" | "liability")} className={inputClass()}>
              <option value="asset">Ativo</option>
              <option value="liability">Passivo</option>
            </select>
            <input placeholder="Valor inicial (€)" value={balInitial} onChange={(e) => setBalInitial(e.target.value)} className={inputClass()} />
            <input placeholder="Valor atual (€)" value={balCurrent} onChange={(e) => setBalCurrent(e.target.value)} className={inputClass()} />
            <button type="submit" className={`${btnPrimary()} sm:col-span-2 w-fit`}>Adicionar</button>
          </form>
          <ul className="mt-4 space-y-2 text-sm">
            {balanceItems.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-black/5 pt-2">
                <span>
                  <strong>{b.description}</strong> · {b.kind === "asset" ? "Ativo" : "Passivo"}
                  <br />
                  <span className="text-[var(--nu-muted)]">
                    Inicial {formatEuroCents(b.initialCents)} → Atual {formatEuroCents(b.currentCents)}
                  </span>
                </span>
                <button type="button" onClick={() => deleteBalanceItem(b.id).then(refresh)} className={btnGhost()}>Apagar</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "emprestimos" && (
        <section className={cardClass()}>
          <h2 className="font-medium text-[var(--nu-ink)]">Empréstimos</h2>
          <form
            className="mt-4 grid gap-2 sm:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const cents = parseEuroInput(loanAmount);
              if (!loanDesc.trim() || cents == null) return;
              await addLoan({
                description: loanDesc,
                initialCents: cents,
                termMonths: Number(loanTerm) || 120,
                annualRatePercent: Number(loanRate.replace(",", ".")) || 0,
                startDateLocal: localDateKey(),
                linkLiability: true,
              });
              setLoanDesc(""); setLoanAmount("");
              await refresh();
            }}
          >
            <input placeholder="Descrição" value={loanDesc} onChange={(e) => setLoanDesc(e.target.value)} className={inputClass()} />
            <input placeholder="Valor (€)" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className={inputClass()} />
            <input placeholder="Prazo (meses)" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className={inputClass()} />
            <input placeholder="Taxa anual (%)" value={loanRate} onChange={(e) => setLoanRate(e.target.value)} className={inputClass()} />
            <button type="submit" className={`${btnPrimary()} w-fit`}>Registar</button>
          </form>
          <ul className="mt-4 space-y-2 text-sm">
            {loans.map((l) => (
              <li key={l.id} className="flex justify-between border-t border-black/5 pt-2">
                <span>
                  <strong>{l.description}</strong>
                  <br />
                  <span className="text-[var(--nu-muted)]">
                    {formatEuroCents(l.initialCents)} · {l.termMonths} meses · {l.annualRatePercent}% a.a.
                  </span>
                </span>
                <button type="button" onClick={() => deleteLoan(l.id).then(refresh)} className={btnGhost()}>Apagar</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "compras" && (
        <section className={cardClass()}>
          <h2 className="font-medium text-[var(--nu-ink)]">Lista de compras</h2>
          <form
            className="mt-4 flex flex-wrap gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!shopDesc.trim()) return;
              const max = shopMax ? parseEuroInput(shopMax) : null;
              await addShoppingItem({
                description: shopDesc,
                maxSpendCents: max,
                month,
                year,
              });
              setShopDesc(""); setShopMax("");
              await refresh();
            }}
          >
            <input placeholder="Item a comprar" value={shopDesc} onChange={(e) => setShopDesc(e.target.value)} className={`${inputClass()} min-w-[12rem] flex-1`} />
            <input placeholder="Máx. (€)" value={shopMax} onChange={(e) => setShopMax(e.target.value)} className={inputClass()} />
            <button type="submit" className={btnPrimary()}>Adicionar</button>
          </form>
          <ul className="mt-4 space-y-2 text-sm">
            {shopping.map((s) => (
              <li key={s.id} className="flex items-center gap-3">
                <input type="checkbox" checked={s.done} onChange={() => toggleShoppingItem(s.id).then(refresh)} />
                <span className={s.done ? "line-through text-[var(--nu-muted)]" : ""}>
                  {s.description}
                  {s.maxSpendCents != null && ` (até ${formatEuroCents(s.maxSpendCents)})`}
                  {s.month && ` · ${MONTHS[s.month - 1]}`}
                </span>
                <button type="button" onClick={() => deleteShoppingItem(s.id).then(refresh)} className={btnGhost()}>Apagar</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "mesada" && (
        <section className={cardClass()}>
          <h2 className="font-medium text-[var(--nu-ink)]">Mesada digital</h2>
          <form
            className="mt-3 flex flex-wrap gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const cents = parseEuroInput(weeklyAllowance);
              if (!childName.trim() || cents == null || cents <= 0) return;
              await addAllowance({ childName: childName.trim(), weeklyAmountCents: cents });
              setChildName(""); setWeeklyAllowance("");
              await refresh();
            }}
          >
            <input placeholder="Nome do filho" value={childName} onChange={(e) => setChildName(e.target.value)} className={inputClass()} />
            <input placeholder="Semanal (€)" value={weeklyAllowance} onChange={(e) => setWeeklyAllowance(e.target.value)} className={inputClass()} />
            <button type="submit" className={btnPrimary()}>Adicionar</button>
          </form>
          {allowances.map((a) => (
            <div key={a.id} className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/5 pt-3 text-sm">
              <span className="font-medium">{a.childName}</span>
              <span className="text-[var(--nu-muted)]">
                {formatEuroCents(a.weeklyAmountCents)}/sem · Saldo {formatEuroCents(a.balanceCents)}
              </span>
              <button type="button" onClick={() => creditAllowance(a.id).then(refresh)} className="rounded-full bg-[var(--nu-accent)]/40 px-3 py-1 text-xs font-medium">
                Creditar semana
              </button>
            </div>
          ))}
        </section>
      )}

      {tab === "importar" && (
        <section className={cardClass()}>
          <h2 className="font-medium text-[var(--nu-ink)]">Importar extrato / planilha</h2>
          <p className="mt-2 text-sm text-[var(--nu-muted)]">
            Suporta CSV, OFX e Excel (.xlsx) com aba «Entradas e Saídas».
          </p>
          <input
            type="file"
            accept=".csv,.ofx,.xlsx,.xls"
            className="mt-4 text-sm"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFileImport(f);
            }}
          />
          {importMsg && <p className="mt-2 text-sm text-[var(--nu-ink)]">{importMsg}</p>}
          {importPreview.length > 0 && (
            <>
              <div className="mt-4 max-h-48 overflow-y-auto text-xs">
                {importPreview.slice(0, 15).map((r, i) => (
                  <p key={i} className="text-[var(--nu-muted)]">
                    {r.dateLocal} · {r.type} · {r.description} · {r.categoryLabel} · {formatEuroCents(r.amountCents)}
                  </p>
                ))}
                {importPreview.length > 15 && (
                  <p className="text-[var(--nu-muted)]">… e mais {importPreview.length - 15}</p>
                )}
              </div>
              <button
                type="button"
                className={`${btnPrimary()} mt-4`}
                onClick={async () => {
                  const result = await commitImport(importPreview);
                  setImportMsg(
                    `Importados ${result.imported} movimentos` +
                      (result.createdCategories.length
                        ? ` · novas categorias: ${result.createdCategories.join(", ")}`
                        : ""),
                  );
                  setImportPreview([]);
                  await refresh();
                }}
              >
                Confirmar importação
              </button>
            </>
          )}
        </section>
      )}
    </div>
  );
}
