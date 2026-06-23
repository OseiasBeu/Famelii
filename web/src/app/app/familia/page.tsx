import { FamilyPanel } from "@/components/family-panel";

export const metadata = {
  title: "Família — Famelii",
};

export default function FamiliaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">A minha família</h1>
        <p className="mt-2 text-sm text-[var(--nu-muted)]">
          Gere os membros, papéis e informações da tua família.
        </p>
      </div>
      <FamilyPanel />
    </div>
  );
}
