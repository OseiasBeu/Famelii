import { FinanceMvpPanel } from "@/components/finance-mvp-panel";

export const metadata = {
  title: "Finanças — Famelii",
};

export default function FinancasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Finanças da família</h1>
        <p className="mt-2 text-sm text-[var(--nu-muted)]">
          Registo manual, orçamento semanal e mesada — visível para{" "}
          <strong className="font-medium text-[var(--nu-ink)]">tutores</strong> (§36).
          Importação de extrato bancário numa fase seguinte.
        </p>
      </div>
      <FinanceMvpPanel />
    </div>
  );
}
