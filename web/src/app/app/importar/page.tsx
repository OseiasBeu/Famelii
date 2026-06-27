import { ImportPanel } from "@/components/import-panel";

export const metadata = {
  title: "Importar extrato — Famelii",
};

export default function ImportarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Importar extrato</h1>
        <p className="mt-2 text-sm text-[var(--nu-muted)]">
          Importa extratos bancários em CSV, OFX ou Excel. Suporta bancos
          portugueses e brasileiros — o formato é detetado automaticamente.
        </p>
      </div>
      <ImportPanel />
    </div>
  );
}
