import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  addAllowance,
  addBalanceItem,
  addLoan,
  addShoppingItem,
  addTransaction,
  creditAllowance,
  currentYearMonth,
  deleteBalanceItem,
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
  listLoans,
  listShoppingItems,
  listTransactionsForMonth,
  localDateKey,
  parseEuroInput,
  setMonthlyBudgetLine,
  toggleShoppingItem,
  type Allowance,
  type FinanceCategory,
  type FinanceTransaction,
  type MonthBudgetSummary,
  type MonthSummary,
  type TransactionType,
} from "@nucleo/core";

const NU = {
  bg: "#faf6f1",
  ink: "#1c1917",
  muted: "#57534e",
  accent: "#c4a574",
};

const TABS = [
  "Resumo",
  "Movimentos",
  "Orçamento",
  "Balanço",
  "Compras",
  "Mesada",
] as const;

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export function FinanceMvpPanel() {
  const now = currentYearMonth();
  const [tab, setTab] = useState(0);
  const [ready, setReady] = useState(false);
  const [year, setYear] = useState(now.year);
  const [month, setMonth] = useState(now.month);

  const [monthSummary, setMonthSummary] = useState<MonthSummary | null>(null);
  const [budgetSummary, setBudgetSummary] = useState<MonthBudgetSummary | null>(null);
  const [yearCashFlow, setYearCashFlow] = useState(0);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [balanceItems, setBalanceItems] = useState<Awaited<ReturnType<typeof listBalanceItems>>>([]);
  const [loans, setLoans] = useState<Awaited<ReturnType<typeof listLoans>>>([]);
  const [shopping, setShopping] = useState<Awaited<ReturnType<typeof listShoppingItems>>>([]);
  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [totals, setTotals] = useState({ assets: 0, liabilities: 0, net: 0 });

  const [txType, setTxType] = useState<TransactionType>("expense");
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState("");
  const [txDescription, setTxDescription] = useState("");

  const [budgetCat, setBudgetCat] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");

  const [balDesc, setBalDesc] = useState("");
  const [balAmount, setBalAmount] = useState("");

  const [shopDesc, setShopDesc] = useState("");
  const [childName, setChildName] = useState("");
  const [weeklyAllowance, setWeeklyAllowance] = useState("");

  const catsForType = useMemo(
    () => categories.filter((c) => c.kind === txType),
    [categories, txType],
  );

  const categoryLabel = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.label ?? id,
    [categories],
  );

  const refresh = useCallback(async () => {
    const [ms, ys, bs, txs, cats, bal, ln, shop, all, tot] = await Promise.all([
      getMonthSummary(year, month),
      getYearSummary(year),
      getMonthBudgetSummary(year, month),
      listTransactionsForMonth(year, month),
      listCategories(),
      listBalanceItems(),
      listLoans(),
      listShoppingItems(),
      listAllowances(),
      getTotalBalance(),
    ]);
    setMonthSummary(ms);
    setYearCashFlow(ys.cashFlowCents);
    setBudgetSummary(bs);
    setTransactions(txs);
    setCategories(cats);
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
  }, [year, month, txCategory, budgetCat]);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, [refresh]);

  useEffect(() => {
    const exp = categories.find((c) => c.kind === txType);
    if (exp) setTxCategory(exp.id);
  }, [txType, categories]);

  if (!ready) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={NU.ink} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.hint}>Modo tutor · dados neste dispositivo.</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
        {TABS.map((label, i) => (
          <Pressable
            key={label}
            onPress={() => setTab(i)}
            style={[styles.tab, tab === i && styles.tabOn]}
          >
            <Text style={tab === i ? styles.tabTextOn : styles.muted}>{label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.periodRow}>
        <Pressable onPress={() => setMonth((m) => (m > 1 ? m - 1 : 12))}>
          <Text style={styles.bold}>‹</Text>
        </Pressable>
        <Text style={styles.bold}>{MONTHS[month - 1]} {year}</Text>
        <Pressable onPress={() => setMonth((m) => (m < 12 ? m + 1 : 1))}>
          <Text style={styles.bold}>›</Text>
        </Pressable>
      </View>

      {tab === 0 && monthSummary && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo mensal</Text>
          <Text style={styles.row}>Renda: <Text style={styles.positive}>{formatEuroCents(monthSummary.incomeCents)}</Text></Text>
          <Text style={styles.row}>Despesas: <Text style={styles.negative}>{formatEuroCents(monthSummary.expenseCents)}</Text></Text>
          <Text style={styles.row}>Fluxo: {formatEuroCents(monthSummary.cashFlowCents)}</Text>
          <Text style={styles.row}>Ativos: {formatEuroCents(totals.assets)}</Text>
          <Text style={styles.row}>Passivos: {formatEuroCents(totals.liabilities)}</Text>
          <Text style={styles.muted}>Ano {year}: fluxo {formatEuroCents(yearCashFlow)}</Text>
        </View>
      )}

      {tab === 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Registar movimento</Text>
          <View style={styles.typeRow}>
            {(["expense", "income"] as const).map((t) => (
              <Pressable key={t} onPress={() => setTxType(t)} style={[styles.typeBtn, txType === t && styles.typeBtnOn]}>
                <Text style={txType === t ? styles.typeBtnTextOn : styles.muted}>
                  {t === "expense" ? "Saída" : "Entrada"}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput style={styles.input} placeholder="Valor (€)" keyboardType="decimal-pad" value={txAmount} onChangeText={setTxAmount} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {catsForType.map((c) => (
              <Pressable key={c.id} onPress={() => setTxCategory(c.id)} style={[styles.catChip, txCategory === c.id && styles.catChipOn]}>
                <Text style={styles.catChipText}>{c.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <TextInput style={styles.input} placeholder="Descrição" value={txDescription} onChangeText={setTxDescription} />
          <Pressable
            style={styles.btn}
            onPress={async () => {
              const cents = parseEuroInput(txAmount);
              if (cents == null || cents <= 0 || !txCategory) return;
              await addTransaction({
                type: txType,
                amountCents: cents,
                categoryId: txCategory,
                description: txDescription || (txType === "expense" ? "Despesa" : "Receita"),
                dateLocal: localDateKey(),
              });
              setTxAmount("");
              setTxDescription("");
              await refresh();
            }}
          >
            <Text style={styles.btnText}>Guardar</Text>
          </Pressable>
          <Text style={[styles.cardTitle, { marginTop: 12 }]}>Movimentos do mês</Text>
          {transactions.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bold}>{tx.description}</Text>
                <Text style={styles.mutedSmall}>{categoryLabel(tx.categoryId)} · {tx.dateLocal}</Text>
              </View>
              <Text style={tx.type === "expense" ? styles.negative : styles.positive}>
                {tx.type === "expense" ? "−" : "+"}{formatEuroCents(tx.amountCents)}
              </Text>
              <Pressable onPress={() => deleteTransaction(tx.id).then(refresh)}>
                <Text style={styles.mutedSmall}>Apagar</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {tab === 2 && budgetSummary && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Orçamento projetado vs realizado</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
            {categories.map((c) => (
              <Pressable key={c.id} onPress={() => setBudgetCat(c.id)} style={[styles.catChip, budgetCat === c.id && styles.catChipOn]}>
                <Text style={styles.catChipText}>{c.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <TextInput style={styles.input} placeholder="Projetado (€)" keyboardType="decimal-pad" value={budgetAmount} onChangeText={setBudgetAmount} />
          <Pressable
            style={styles.btnOutline}
            onPress={async () => {
              const cents = parseEuroInput(budgetAmount);
              if (cents == null || !budgetCat) return;
              await setMonthlyBudgetLine({ year, month, categoryId: budgetCat, projectedCents: cents });
              setBudgetAmount("");
              await refresh();
            }}
          >
            <Text style={styles.bold}>Definir linha</Text>
          </Pressable>
          {[...budgetSummary.income, ...budgetSummary.expense].map((line) => (
            <View key={line.categoryId} style={styles.txRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bold}>{line.categoryLabel}</Text>
                <Text style={styles.mutedSmall}>
                  Proj. {formatEuroCents(line.projectedCents)} · Real. {formatEuroCents(line.actualCents)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {tab === 3 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Balanço e empréstimos</Text>
          <TextInput style={styles.input} placeholder="Descrição ativo/passivo" value={balDesc} onChangeText={setBalDesc} />
          <TextInput style={styles.input} placeholder="Valor atual (€)" keyboardType="decimal-pad" value={balAmount} onChangeText={setBalAmount} />
          <Pressable
            style={styles.btnOutline}
            onPress={async () => {
              const cents = parseEuroInput(balAmount);
              if (!balDesc.trim() || cents == null) return;
              await addBalanceItem({
                description: balDesc,
                category: "ATIVO",
                kind: "asset",
                startDateLocal: localDateKey(),
                initialCents: cents,
                currentCents: cents,
              });
              setBalDesc("");
              setBalAmount("");
              await refresh();
            }}
          >
            <Text style={styles.bold}>Adicionar ativo</Text>
          </Pressable>
          {balanceItems.map((b) => (
            <View key={b.id} style={styles.txRow}>
              <Text style={styles.bold}>{b.description} ({b.kind})</Text>
              <Text style={styles.mutedSmall}>{formatEuroCents(b.currentCents)}</Text>
              <Pressable onPress={() => deleteBalanceItem(b.id).then(refresh)}>
                <Text style={styles.mutedSmall}>Apagar</Text>
              </Pressable>
            </View>
          ))}
          <Pressable
            style={[styles.btnOutline, { marginTop: 8 }]}
            onPress={async () => {
              const cents = parseEuroInput(balAmount);
              if (!balDesc.trim() || cents == null) return;
              await addLoan({
                description: balDesc,
                initialCents: cents,
                termMonths: 120,
                annualRatePercent: 5.5,
                startDateLocal: localDateKey(),
                linkLiability: true,
              });
              setBalDesc("");
              setBalAmount("");
              await refresh();
            }}
          >
            <Text style={styles.bold}>Registar empréstimo</Text>
          </Pressable>
          {loans.map((l) => (
            <Text key={l.id} style={styles.mutedSmall}>
              {l.description}: {formatEuroCents(l.initialCents)} · {l.termMonths}m · {l.annualRatePercent}%
            </Text>
          ))}
        </View>
      )}

      {tab === 4 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lista de compras</Text>
          <TextInput style={styles.input} placeholder="Item" value={shopDesc} onChangeText={setShopDesc} />
          <Pressable
            style={styles.btnOutline}
            onPress={async () => {
              if (!shopDesc.trim()) return;
              await addShoppingItem({ description: shopDesc, month, year });
              setShopDesc("");
              await refresh();
            }}
          >
            <Text style={styles.bold}>Adicionar</Text>
          </Pressable>
          {shopping.map((s) => (
            <View key={s.id} style={styles.txRow}>
              <Pressable onPress={() => toggleShoppingItem(s.id).then(refresh)}>
                <Text>{s.done ? "☑" : "☐"}</Text>
              </Pressable>
              <Text style={[styles.bold, s.done && styles.muted]}>{s.description}</Text>
              <Pressable onPress={() => deleteShoppingItem(s.id).then(refresh)}>
                <Text style={styles.mutedSmall}>Apagar</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {tab === 5 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mesada digital</Text>
          <TextInput style={styles.input} placeholder="Nome do filho" value={childName} onChangeText={setChildName} />
          <TextInput style={styles.input} placeholder="Semanal (€)" keyboardType="decimal-pad" value={weeklyAllowance} onChangeText={setWeeklyAllowance} />
          <Pressable
            style={styles.btnOutline}
            onPress={async () => {
              const cents = parseEuroInput(weeklyAllowance);
              if (!childName.trim() || cents == null || cents <= 0) return;
              await addAllowance({ childName: childName.trim(), weeklyAmountCents: cents });
              setChildName("");
              setWeeklyAllowance("");
              await refresh();
            }}
          >
            <Text style={styles.bold}>Adicionar filho</Text>
          </Pressable>
          {allowances.map((a) => (
            <View key={a.id} style={styles.allowRow}>
              <Text style={styles.bold}>{a.childName}</Text>
              <Text style={styles.mutedSmall}>
                {formatEuroCents(a.weeklyAmountCents)}/sem · Saldo {formatEuroCents(a.balanceCents)}
              </Text>
              <Pressable style={styles.btnOutline} onPress={() => creditAllowance(a.id).then(refresh)}>
                <Text style={styles.mutedSmall}>Creditar semana</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40, gap: 8 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  hint: { fontSize: 12, color: NU.muted, marginBottom: 8 },
  tabRow: { marginBottom: 8, maxHeight: 40 },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d6d3d1",
    marginRight: 6,
  },
  tabOn: { backgroundColor: NU.ink, borderColor: NU.ink },
  tabTextOn: { color: NU.bg, fontWeight: "600", fontSize: 12 },
  periodRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: NU.ink },
  muted: { fontSize: 13, color: NU.muted },
  mutedSmall: { fontSize: 12, color: NU.muted },
  bold: { fontWeight: "600", color: NU.ink },
  row: { fontSize: 14, color: NU.muted },
  input: {
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: NU.ink,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  btnText: { color: NU.bg, fontWeight: "600", fontSize: 14 },
  btnOutline: {
    borderWidth: 1,
    borderColor: "#d6d3d1",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  typeRow: { flexDirection: "row", gap: 8 },
  typeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d6d3d1",
  },
  typeBtnOn: { backgroundColor: NU.ink, borderColor: NU.ink },
  typeBtnTextOn: { color: NU.bg, fontWeight: "600" },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    marginRight: 6,
  },
  catChipOn: { backgroundColor: NU.accent, borderColor: NU.accent },
  catChipText: { fontSize: 12, color: NU.ink },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f4",
  },
  positive: { color: "#166534", fontWeight: "600" },
  negative: { color: "#991b1b", fontWeight: "600" },
  allowRow: { gap: 4, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#f5f5f4" },
});
