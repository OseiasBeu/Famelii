"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MOOD_OPTIONS,
  PRIVACY_OPTIONS,
  loadCheckIn,
  localDateKey,
  saveCheckIn,
  type CheckInPrivacy,
  type MoodId,
} from "@famelii/core";

export function EmotionalCheckInForm() {
  const today = useMemo(() => localDateKey(), []);

  const [mood, setMood] = useState<MoodId | null>(null);
  const [note, setNote] = useState("");
  const [privacy, setPrivacy] = useState<CheckInPrivacy>("all");
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    loadCheckIn(today).then((existing) => {
      if (!active) return;
      if (existing) {
        setMood(existing.mood);
        setNote(existing.note);
        setPrivacy(existing.privacy);
        setSaved(true);
      }
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [today]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mood) return;
    await saveCheckIn({
      dateLocal: today,
      mood,
      note: note.trim(),
      privacy,
      updatedAt: new Date().toISOString(),
    });
    setSaved(true);
  }

  if (!ready) {
    return (
      <p className="text-sm text-[var(--nu-muted)]" aria-live="polite">
        A carregar…
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8"
      aria-labelledby="checkin-heading"
    >
      <div>
        <h2 id="checkin-heading" className="text-lg font-semibold text-[var(--nu-ink)]">
          Como estás hoje?
        </h2>
        <p className="mt-1 text-sm text-[var(--nu-muted)]">
          {today} · Os dados ficam neste dispositivo até ligares o Supabase.
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="sr-only">Estado de humor</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MOOD_OPTIONS.map((opt) => {
            const selected = mood === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMood(opt.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl border px-3 py-4 text-sm transition ${
                  selected
                    ? "border-[var(--nu-accent-strong)] bg-[var(--nu-accent)]/25 ring-2 ring-[var(--nu-accent-strong)]/30"
                    : "border-black/10 bg-white/60 hover:border-black/20 dark:border-white/15 dark:bg-white/5"
                }`}
                aria-pressed={selected}
              >
                <span className="text-2xl" aria-hidden>
                  {opt.emoji}
                </span>
                <span className="font-medium text-[var(--nu-ink)]">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="checkin-note" className="text-sm font-medium text-[var(--nu-ink)]">
          Observação (opcional)
        </label>
        <textarea
          id="checkin-note"
          name="note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full resize-y rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm text-[var(--nu-ink)] placeholder:text-[var(--nu-muted)] dark:border-white/15 dark:bg-black/30"
          placeholder="Algo que queiras registar só para ti ou para a família…"
          maxLength={2000}
        />
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-[var(--nu-ink)]">Privacidade</span>
        <div className="flex flex-col gap-2">
          {PRIVACY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer gap-3 rounded-xl border px-3 py-3 text-sm ${
                privacy === opt.value
                  ? "border-[var(--nu-accent-strong)] bg-[var(--nu-accent)]/15"
                  : "border-black/10 bg-white/50 dark:border-white/15 dark:bg-white/5"
              }`}
            >
              <input
                type="radio"
                name="privacy"
                value={opt.value}
                checked={privacy === opt.value}
                onChange={() => setPrivacy(opt.value)}
                className="mt-1"
              />
              <span>
                <span className="font-medium text-[var(--nu-ink)]">{opt.label}</span>
                <span className="mt-0.5 block text-xs text-[var(--nu-muted)]">
                  {opt.hint}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={!mood}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--nu-ink)] px-8 text-sm font-medium text-[var(--nu-bg)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Guardar check-in
        </button>
        {saved && (
          <p className="text-sm text-[var(--nu-accent-strong)]" role="status">
            Guardado neste dispositivo.
          </p>
        )}
      </div>
    </form>
  );
}
