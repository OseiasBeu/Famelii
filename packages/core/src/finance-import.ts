import type {
  FinanceStore,
  ImportPreviewRow,
  ImportResult,
  PaymentMethod,
  TransactionType,
} from "./types/finance";
import { parseDateLocal, parseEuroFromSpreadsheet } from "./finance-utils";

function normalizeHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function classifyType(value: string): TransactionType | null {
  const v = normalizeHeader(value);
  if (v === "entrada" || v === "receita" || v === "income") return "income";
  if (v === "saida" || v === "saída" || v === "despesa" || v === "expense")
    return "expense";
  return null;
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if ((ch === "," || ch === ";") && !inQuotes) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((c) => c.trim());
}

export function parseCsvTransactions(text: string): ImportPreviewRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const header = parseCsvLine(lines[0]).map(normalizeHeader);
  const idx = (names: string[]) =>
    header.findIndex((h) => names.some((n) => h.includes(n)));

  const iDate = idx(["data", "date"]);
  const iType = idx(["classificacao", "tipo", "type"]);
  const iDesc = idx(["descricao", "description", "memo"]);
  const iCat = idx(["categoria", "category"]);
  const iVal = idx(["valor", "amount", "montante"]);
  const iYear = idx(["ano", "year"]);
  const iMonth = idx(["mes", "month"]);

  const rows: ImportPreviewRow[] = [];
  for (let li = 1; li < lines.length; li++) {
    const cols = parseCsvLine(lines[li]);
    if (!cols.some(Boolean)) continue;

    let dateLocal: string | null = null;
    if (iDate >= 0) dateLocal = parseDateLocal(cols[iDate] ?? "");
    if (!dateLocal && iYear >= 0 && iMonth >= 0) {
      const y = Number(cols[iYear]);
      const m = Number(cols[iMonth]);
      const d = iDate >= 0 ? cols[iDate] : "01";
      const day = String(d).padStart(2, "0").slice(-2);
      if (y && m) dateLocal = `${y}-${String(m).padStart(2, "0")}-${day}`;
    }
    if (!dateLocal) continue;

    const type = iType >= 0 ? classifyType(cols[iType] ?? "") : null;
    const amountCents =
      iVal >= 0 ? parseEuroFromSpreadsheet(cols[iVal] ?? "") : null;
    if (amountCents == null || amountCents <= 0) continue;

    rows.push({
      dateLocal,
      type: type ?? "expense",
      description: (iDesc >= 0 ? cols[iDesc] : "") || "Importado",
      categoryLabel: (iCat >= 0 ? cols[iCat] : "") || "Outras",
      amountCents,
    });
  }
  return rows;
}

export function parseOfxTransactions(text: string): ImportPreviewRow[] {
  const rows: ImportPreviewRow[] = [];
  const blocks = text.split(/<STMTTRN>/i).slice(1);
  for (const block of blocks) {
    const get = (tag: string) => {
      const m = new RegExp(`<${tag}>([^<\\r\\n]+)`, "i").exec(block);
      return m?.[1]?.trim() ?? "";
    };
    const trnType = get("TRNTYPE").toUpperCase();
    const amount = Number(get("AMOUNT").replace(",", "."));
    const dateRaw = get("DTPOSTED").slice(0, 8);
    const memo = get("MEMO") || get("NAME") || "Importado OFX";
    if (!dateRaw || !Number.isFinite(amount)) continue;
    const dateLocal = `${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}`;
    const type: TransactionType =
      trnType === "CREDIT" || amount > 0 ? "income" : "expense";
    rows.push({
      dateLocal,
      type,
      description: memo,
      categoryLabel: "Outras",
      amountCents: Math.round(Math.abs(amount) * 100),
      paymentMethod: "transfer",
    });
  }
  return rows;
}

/** Linhas da aba «Entradas e Saídas» (array de colunas). */
export function parseSpreadsheetLedgerRows(
  matrix: unknown[][],
): ImportPreviewRow[] {
  const headerRow = matrix.find(
    (r) =>
      Array.isArray(r) &&
      r.some((c) => String(c).includes("Classificação")),
  ) as string[] | undefined;
  if (!headerRow) return [];

  const norm = headerRow.map((h) => normalizeHeader(String(h)));
  const idx = (name: string) => norm.findIndex((h) => h.includes(name));

  const iClass = idx("classificacao");
  const iDate = idx("data");
  const iDesc = idx("descricao");
  const iCat = idx("categoria");
  const iVal = idx("valor");
  const iYear = idx("ano");
  const iMonth = idx("mes");
  const iPay = idx("forma");

  const start = matrix.indexOf(headerRow) + 1;
  const rows: ImportPreviewRow[] = [];

  for (let i = start; i < matrix.length; i++) {
    const r = matrix[i] as unknown[];
    if (!r?.length) continue;
    const type = classifyType(String(r[iClass] ?? ""));
    if (!type) continue;

    let dateLocal = parseDateLocal(String(r[iDate] ?? ""));
    if (!dateLocal && iYear >= 0 && iMonth >= 0) {
      const y = Number(r[iYear]);
      const m = Number(r[iMonth]);
      if (y && m) {
        dateLocal = `${y}-${String(m).padStart(2, "0")}-01`;
      }
    }
    if (!dateLocal) continue;

    const amountCents = parseEuroFromSpreadsheet(String(r[iVal] ?? ""));
    if (amountCents == null || amountCents <= 0) continue;

    const payRaw = iPay >= 0 ? String(r[iPay] ?? "").toLowerCase() : "";
    let paymentMethod: PaymentMethod | undefined;
    if (payRaw.includes("cart")) paymentMethod = "card";
    else if (payRaw.includes("mb")) paymentMethod = "mbway";
    else if (payRaw.includes("transf")) paymentMethod = "transfer";
    else if (payRaw.includes("din")) paymentMethod = "cash";

    rows.push({
      dateLocal,
      type,
      description: String(r[iDesc] ?? "") || "Importado",
      categoryLabel: String(r[iCat] ?? "") || "Outras",
      amountCents,
      paymentMethod,
    });
  }
  return rows;
}

export function resolveCategoryId(
  store: FinanceStore,
  label: string,
  type: TransactionType,
): { categoryId: string; created: boolean } {
  const norm = label.trim().toLowerCase();
  const existing = store.categories.find(
    (c) => c.kind === type && c.label.trim().toLowerCase() === norm,
  );
  if (existing) return { categoryId: existing.id, created: false };
  const fuzzy = store.categories.find(
    (c) =>
      c.kind === type &&
      (c.label.toLowerCase().includes(norm) ||
        norm.includes(c.label.toLowerCase())),
  );
  if (fuzzy) return { categoryId: fuzzy.id, created: false };
  return { categoryId: "", created: true };
}

export function summarizeImport(
  imported: number,
  createdCategories: string[],
): ImportResult {
  return {
    imported,
    skipped: 0,
    createdCategories: [...new Set(createdCategories)],
  };
}
