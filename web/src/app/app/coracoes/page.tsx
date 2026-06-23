import { HeartsPanel } from "@/components/hearts-panel";

export const metadata = {
  title: "Corações — Famelii",
};

export default function CoracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Corações</h1>
        <p className="mt-2 text-sm text-[var(--nu-muted)]">
          Mural de afeto — agradece, reconhece e celebra os membros da tua família.
        </p>
      </div>
      <HeartsPanel />
    </div>
  );
}
