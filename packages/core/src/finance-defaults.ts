import type { CategoryGroup, FinanceCategory, FinanceStore } from "./types/finance";

function slug(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function gid(label: string): string {
  return `grp-${slug(label)}`;
}

function cid(groupLabel: string, label: string): string {
  return `cat-${slug(groupLabel)}-${slug(label)}`;
}

type SeedRow = { group: string; label: string; kind: "expense" | "income" };

const EXPENSE_SEED: SeedRow[] = [
  { group: "Despesas essenciais", label: "Carro", kind: "expense" },
  { group: "Despesas essenciais", label: "Seguro Carro", kind: "expense" },
  { group: "Despesas essenciais", label: "Combustível", kind: "expense" },
  { group: "Despesas essenciais", label: "Manutenção do Carro", kind: "expense" },
  { group: "Despesas essenciais", label: "Transporte", kind: "expense" },
  { group: "Despesas essenciais", label: "Título de Transporte", kind: "expense" },
  { group: "Morada", label: "Arrendamento", kind: "expense" },
  { group: "Morada", label: "Internet", kind: "expense" },
  { group: "Morada", label: "Supermercado", kind: "expense" },
  { group: "Morada", label: "Produtos de Limpeza", kind: "expense" },
  { group: "Saúde", label: "Plano de Saúde", kind: "expense" },
  { group: "Saúde", label: "Farmácia", kind: "expense" },
  { group: "Educação", label: "Academia de Dança", kind: "expense" },
  { group: "Educação", label: "Academia de Boxe", kind: "expense" },
  { group: "Educação", label: "Cursos Extras", kind: "expense" },
  { group: "Taxas Bancárias", label: "Seguro cartão", kind: "expense" },
  { group: "Taxas Bancárias", label: "IRS/IRC", kind: "expense" },
  { group: "Despesas não essenciais", label: "Restaurantes e Saídas", kind: "expense" },
  { group: "Despesas não essenciais", label: "Streaming", kind: "expense" },
  { group: "Despesas não essenciais", label: "Presentes", kind: "expense" },
  { group: "Despesas não essenciais", label: "Viagens", kind: "expense" },
  { group: "Despesas não essenciais", label: "Roupas", kind: "expense" },
  { group: "Despesas não essenciais", label: "Calçados", kind: "expense" },
  { group: "Despesas não essenciais", label: "Uber/Bolt", kind: "expense" },
  { group: "Despesas não essenciais", label: "Cuidados pessoais", kind: "expense" },
  { group: "Despesas não essenciais", label: "Estacionamento/Portagem", kind: "expense" },
  { group: "Despesas não essenciais", label: "Despesas Gerais", kind: "expense" },
  { group: "Dízimo", label: "Dízimo", kind: "expense" },
  { group: "Investimentos", label: "Investimentos", kind: "expense" },
];

const INCOME_SEED: SeedRow[] = [
  { group: "Receitas", label: "Salário", kind: "income" },
  { group: "Receitas", label: "Médias Visuais", kind: "income" },
  { group: "Receitas", label: "Aulas de Dança", kind: "income" },
  { group: "Receitas", label: "Aulas de Luta", kind: "income" },
  { group: "Receitas", label: "Freelance", kind: "income" },
  { group: "Receitas", label: "Proventos", kind: "income" },
  { group: "Receitas", label: "Aluguer de Motas", kind: "income" },
  { group: "Receitas", label: "Outras", kind: "income" },
];

export function buildDefaultFinanceStore(): Pick<
  FinanceStore,
  "categoryGroups" | "categories"
> {
  const groups = new Map<string, CategoryGroup>();
  const categories: FinanceCategory[] = [];
  let gOrder = 0;
  let cOrder = 0;

  const all = [...EXPENSE_SEED, ...INCOME_SEED];
  for (const row of all) {
    if (!groups.has(row.group)) {
      const kind =
        row.kind === "income"
          ? "income"
          : row.group === "Receitas"
            ? "income"
            : "expense";
      groups.set(row.group, {
        id: gid(row.group),
        label: row.group,
        kind,
        sortOrder: gOrder++,
      });
    }
    categories.push({
      id: cid(row.group, row.label),
      groupId: gid(row.group),
      label: row.label,
      kind: row.kind,
      sortOrder: cOrder++,
    });
  }

  return {
    categoryGroups: [...groups.values()],
    categories,
  };
}

export function emptyFinanceStore(): FinanceStore {
  const defaults = buildDefaultFinanceStore();
  return {
    version: 2,
    ...defaults,
    transactions: [],
    monthlyBudgets: [],
    allowances: [],
    balanceItems: [],
    loans: [],
    shoppingList: [],
  };
}
