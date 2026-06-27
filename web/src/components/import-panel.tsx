"use client";

import { useCallback, useState } from "react";
import {
  commitImport,
  formatEuroCents,
  previewImportFromSpreadsheetRows,
  previewImportFromText,
  type ImportPreviewRow,
} from "@famelii/core";

const card = "rounded-2xl bg-[var(--nu-bg-card)] p-5";
const shadow = { boxShadow: "var(--nu-shadow)" } as const;
const btnPrimary = "rounded-xl bg-[var(--nu-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110";

const SUPPORTED_BANKS = [
  { name: "CSV genérico", formats: ".csv" },
  { name: "OFX / QFX", formats: ".ofx, .qfx" },
  { name: "Excel", formats: ".xlsx, .xls" },
  { name: "CGD / Millennium / Novo Banco", formats: ".csv, .xlsx" },
  { name: "Nubank / Itaú / Bradesco / Inter", formats: ".csv, .ofx" },
];

export function ImportPanel({ onImported }: { onImported?: () => void }) {
  const [preview, setPreview] = useState<ImportPreviewRow[]>([]);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setMessage("");
    setPreview([]);
    setFileName(file.name);
    const name = file.name.toLowerCase();

    try {
      if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
        const XLSX = await import("xlsx");
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array", cellDates: true });
        // Try specific sheet names first, then first sheet
        const sheetName =
          wb.SheetNames.find((n) => n.includes("Entradas")) ??
          wb.SheetNames.find((n) => n.includes("Movimentos")) ??
          wb.SheetNames.find((n) => n.includes("Extrato")) ??
          wb.SheetNames[0];
        const sheet = wb.Sheets[sheetName];
        if (!sheet) {
          setMessage("Nenhuma aba encontrada no ficheiro.");
          return;
        }
        const matrix = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
        }) as unknown[][];
        const rows = await previewImportFromSpreadsheetRows(matrix);
        if (rows.length === 0) {
          // Fallback: try as CSV from first sheet
          const csv = XLSX.utils.sheet_to_csv(sheet, { FS: ";" });
          const csvRows = await previewImportFromText(csv, "csv");
          if (csvRows.length > 0) {
            setPreview(csvRows);
            setMessage(`${csvRows.length} movimentos encontrados em "${sheetName}".`);
            return;
          }
          setMessage("Nenhum movimento reconhecido. Verifica o formato do ficheiro.");
          return;
        }
        setPreview(rows);
        setMessage(`${rows.length} movimentos encontrados em "${sheetName}".`);
        return;
      }

      const text = await file.text();
      const format = name.endsWith(".ofx") || name.endsWith(".qfx") ? "ofx" : "csv";
      const rows = await previewImportFromText(text, format);
      if (rows.length === 0) {
        setMessage("Nenhum movimento reconhecido. Verifica o formato do ficheiro.");
        return;
      }
      setPreview(rows);
      setMessage(`${rows.length} movimentos prontos para importar.`);
    } catch {
      setMessage("Erro ao ler o ficheiro. Verifica o formato.");
    }
  }, []);

  async function handleConfirmImport() {
    if (preview.length === 0) return;
    setImporting(true);
    const result = await commitImport(preview);
    setMessage(
      `Importados ${result.imported} movimentos` +
        (result.createdCategories.length
          ? ` · novas categorias: ${result.createdCategories.join(", ")}`
          : ""),
    );
    setPreview([]);
    setImporting(false);
    onImported?.();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  const incomeCount = preview.filter((r) => r.type === "income").length;
  const expenseCount = preview.filter((r) => r.type === "expense").length;
  const totalIncome = preview.filter((r) => r.type === "income").reduce((s, r) => s + r.amountCents, 0);
  const totalExpense = preview.filter((r) => r.type === "expense").reduce((s, r) => s + r.amountCents, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Drop zone */}
      <div
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging
            ? "border-[var(--nu-accent)] bg-[var(--nu-accent-soft)]"
            : "border-[var(--nu-border)] hover:border-[var(--nu-accent)]/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv,.ofx,.qfx,.xlsx,.xls"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) processFile(f);
          }}
        />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mx-auto h-10 w-10 text-[var(--nu-muted)]">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="mt-3 text-sm font-medium">
          {fileName ? fileName : "Arrasta o ficheiro aqui ou clica para selecionar"}
        </p>
        <p className="mt-1 text-xs text-[var(--nu-muted)]">
          CSV, OFX, QFX, Excel (.xlsx)
        </p>
      </div>

      {/* Supported banks info */}
      <details className="text-xs text-[var(--nu-muted)]">
        <summary className="cursor-pointer font-medium hover:text-[var(--nu-ink)]">
          Bancos e formatos suportados
        </summary>
        <ul className="mt-2 space-y-1 pl-4">
          {SUPPORTED_BANKS.map((b) => (
            <li key={b.name}>
              <span className="font-medium text-[var(--nu-ink)]">{b.name}</span> — {b.formats}
            </li>
          ))}
        </ul>
        <p className="mt-2">
          O parser deteta automaticamente colunas de data, valor, débito/crédito e descrição.
          Funciona com formatos PT (1.234,56) e BR (1234,56 ou 1,234.56).
        </p>
      </details>

      {/* Message */}
      {message && (
        <p className={`text-sm font-medium ${preview.length > 0 ? "text-[var(--nu-success)]" : "text-[var(--nu-ink)]"}`}>
          {message}
        </p>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div className={card} style={shadow}>
          {/* Summary */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-[var(--nu-muted)]">Entradas:</span>{" "}
              <span className="font-semibold text-green-700">{incomeCount} ({formatEuroCents(totalIncome)})</span>
            </div>
            <div>
              <span className="text-[var(--nu-muted)]">Saídas:</span>{" "}
              <span className="font-semibold text-red-700">{expenseCount} ({formatEuroCents(totalExpense)})</span>
            </div>
            <div>
              <span className="text-[var(--nu-muted)]">Total:</span>{" "}
              <span className="font-semibold">{preview.length} movimentos</span>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 max-h-72 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[var(--nu-bg-card)]">
                <tr className="text-left text-[var(--nu-muted)]">
                  <th className="pb-2 pr-3">Data</th>
                  <th className="pb-2 pr-3">Tipo</th>
                  <th className="pb-2 pr-3">Descrição</th>
                  <th className="pb-2 pr-3">Categoria</th>
                  <th className="pb-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nu-border)]">
                {preview.slice(0, 50).map((r, i) => (
                  <tr key={i} className="text-[var(--nu-ink)]">
                    <td className="py-1.5 pr-3 whitespace-nowrap">{r.dateLocal}</td>
                    <td className="py-1.5 pr-3">
                      <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        r.type === "income" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {r.type === "income" ? "Entrada" : "Saída"}
                      </span>
                    </td>
                    <td className="py-1.5 pr-3 max-w-[150px] truncate">{r.description}</td>
                    <td className="py-1.5 pr-3 text-[var(--nu-muted)]">{r.categoryLabel}</td>
                    <td className={`py-1.5 text-right font-medium whitespace-nowrap ${r.type === "income" ? "text-green-700" : "text-red-700"}`}>
                      {r.type === "income" ? "+" : "−"}{formatEuroCents(r.amountCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 50 && (
              <p className="mt-2 text-center text-xs text-[var(--nu-muted)]">
                … e mais {preview.length - 50} movimentos
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-3 border-t pt-4">
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={importing}
              className={`${btnPrimary} disabled:opacity-50`}
            >
              {importing ? "A importar…" : `Importar ${preview.length} movimentos`}
            </button>
            <button
              type="button"
              onClick={() => { setPreview([]); setMessage(""); setFileName(""); }}
              className="rounded-xl border px-4 py-2.5 text-sm font-medium text-[var(--nu-muted)] transition hover:bg-[var(--nu-bg-elevated)]"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
