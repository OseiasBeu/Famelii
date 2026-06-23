"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addHeart,
  deleteHeart,
  listHearts,
  HEART_EMOJIS,
  type Heart,
} from "@famelii/core";

const card = "rounded-2xl bg-[var(--nu-bg-card)] p-5";
const shadow = { boxShadow: "var(--nu-shadow)" } as const;
const input = "w-full rounded-xl border bg-[var(--nu-bg)] px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[var(--nu-accent)]/40";
const btnPrimary = "rounded-xl bg-[var(--nu-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110";

export function HeartsPanel() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [ready, setReady] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("❤️");

  const refresh = useCallback(async () => { setHearts(await listHearts()); }, []);
  useEffect(() => { refresh().finally(() => setReady(true)); }, [refresh]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!from.trim() || !to.trim() || !message.trim()) return;
    await addHeart({ from, to, message, emoji });
    setFrom(""); setTo(""); setMessage(""); setEmoji("❤️");
    setShowForm(false);
    await refresh();
  }

  if (!ready) return <p className="text-sm text-[var(--nu-muted)]">A carregar…</p>;

  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={() => setShowForm(!showForm)} className={`${btnPrimary} w-fit`}>
        {showForm ? "Cancelar" : "+ Enviar coração"}
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className={card} style={shadow}>
          <h3 className="mb-4 text-base font-semibold">Novo coração</h3>
          <div className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="De quem" value={from} onChange={(e) => setFrom(e.target.value)} className={input} required />
              <input placeholder="Para quem" value={to} onChange={(e) => setTo(e.target.value)} className={input} required />
            </div>
            <textarea
              placeholder="Mensagem de carinho, gratidão ou reconhecimento…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className={`${input} resize-y`}
              required
              maxLength={500}
            />
            <div>
              <p className="mb-2 text-xs font-medium text-[var(--nu-muted)]">Escolhe o sentimento</p>
              <div className="flex flex-wrap gap-2">
                {HEART_EMOJIS.map((h) => (
                  <button
                    key={h.emoji}
                    type="button"
                    onClick={() => setEmoji(h.emoji)}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-2.5 transition ${
                      emoji === h.emoji
                        ? "border-[var(--nu-accent)] bg-[var(--nu-accent-soft)] ring-2 ring-[var(--nu-accent)]/30"
                        : "bg-[var(--nu-bg)] hover:bg-[var(--nu-bg-elevated)]"
                    }`}
                  >
                    <span className="text-xl">{h.emoji}</span>
                    <span className="text-[10px] text-[var(--nu-muted)]">{h.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className={`${btnPrimary} w-fit`}>Enviar</button>
          </div>
        </form>
      )}

      {hearts.length === 0 ? (
        <div className="rounded-2xl border border-dashed py-16 text-center">
          <p className="text-5xl">💕</p>
          <p className="mt-4 text-base font-medium text-[var(--nu-ink)]">O mural está vazio</p>
          <p className="mt-1 text-sm text-[var(--nu-muted)]">
            Envia o primeiro coração à tua família!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {hearts.map((h) => (
            <div key={h.id} className={`group relative ${card}`} style={shadow}>
              <div className="flex gap-4">
                <span className="text-4xl">{h.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">
                    {h.from} <span className="font-normal text-[var(--nu-muted)]">para</span> {h.to}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--nu-ink)]">{h.message}</p>
                  <p className="mt-3 text-xs text-[var(--nu-muted)]">{h.dateLocal}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteHeart(h.id).then(refresh)}
                className="absolute right-3 top-3 rounded-lg p-1 text-xs text-[var(--nu-muted)] opacity-0 transition hover:text-[var(--nu-danger)] group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
