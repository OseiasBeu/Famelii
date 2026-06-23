import { MissionsPanel } from "@/components/missions-panel";

export const metadata = {
  title: "Missões — Famelii",
};

export default function MissoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Missões</h1>
        <p className="mt-2 text-sm text-[var(--nu-muted)]">
          Tarefas maiores com responsável, prioridade e prazo. Atribui missões à família!
        </p>
      </div>
      <MissionsPanel />
    </div>
  );
}
