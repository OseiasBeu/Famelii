import Link from "next/link";
import {
  localDateKey,
  isSupabaseConfigured,
  MOOD_OPTIONS,
} from "@famelii/core";

export const metadata = {
  title: "Centro — Famelii",
};

const quickLinks = [
  { href: "/app/calendario", icon: "📅", title: "Calendário", desc: "Eventos e compromissos familiares", color: "#3b82f6" },
  { href: "/app/missoes", icon: "🎯", title: "Missões", desc: "Responsáveis e prazos", color: "#f59e0b" },
  { href: "/app/tarefas", icon: "✅", title: "Tarefas", desc: "Lista rápida do dia-a-dia", color: "#10b981" },
  { href: "/app/financas", icon: "💰", title: "Finanças", desc: "Orçamento e mesada", color: "#8b5cf6" },
  { href: "/app/coracoes", icon: "💕", title: "Corações", desc: "Mural de afeto", color: "#ec4899" },
];

export default function CentroPage() {
  const today = localDateKey();
  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-[var(--nu-accent-strong)]">Bom dia!</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Centro de comando</h1>
        <p className="mt-2 text-sm text-[var(--nu-muted)]">{today}</p>
      </div>

      <section
        className="overflow-hidden rounded-2xl bg-[var(--nu-bg-card)] p-6"
        style={{ boxShadow: "var(--nu-shadow)" }}
        aria-labelledby="humor-heading"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="humor-heading" className="text-lg font-semibold text-[var(--nu-ink)]">
              Como estás hoje?
            </h2>
            <p className="mt-1 text-sm text-[var(--nu-muted)]">
              Regista o teu check-in emocional diário.
            </p>
          </div>
          <Link
            href="/app/check-in"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[var(--nu-accent)] px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            Fazer check-in
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((m) => (
            <span
              key={m.id}
              className="flex items-center gap-1.5 rounded-xl bg-[var(--nu-bg-elevated)] px-3 py-2 text-sm"
            >
              <span>{m.emoji}</span>
              <span className="text-[var(--nu-muted)]">{m.label}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group overflow-hidden rounded-2xl bg-[var(--nu-bg-card)] p-5 transition-all hover:scale-[1.02]"
            style={{ boxShadow: "var(--nu-shadow)" }}
          >
            <div className="flex items-start gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                style={{ backgroundColor: `${link.color}15` }}
              >
                {link.icon}
              </span>
              <div>
                <h3 className="font-semibold text-[var(--nu-ink)] group-hover:text-[var(--nu-accent-strong)]">
                  {link.title}
                </h3>
                <p className="mt-0.5 text-sm text-[var(--nu-muted)]">{link.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <p className="text-xs text-[var(--nu-muted)]">
        Supabase:{" "}
        {supabaseReady ? (
          <span className="text-[var(--nu-success)]">conectado</span>
        ) : (
          <span>offline — dados guardados localmente</span>
        )}
      </p>
    </div>
  );
}
