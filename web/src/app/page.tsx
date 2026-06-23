import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--nu-bg)] text-[var(--nu-ink)]">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-10 px-6 py-16">
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--nu-accent)] text-lg font-bold text-white shadow-sm">
              F
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Famelii
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-pretty text-[var(--nu-muted)]">
            The heart of your family. — O gestor assistente da tua família:
            rotina, humor e casa no mesmo sítio.
          </p>
        </header>

        <ul className="space-y-3 text-sm text-[var(--nu-muted)]">
          <li className="flex gap-2">
            <span className="text-[var(--nu-accent)]" aria-hidden>
              ✓
            </span>
            Check-in emocional e centro de comando
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--nu-accent)]" aria-hidden>
              ✓
            </span>
            Calendário, missões, tarefas e mural de afeto
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--nu-accent)]" aria-hidden>
              ✓
            </span>
            Finanças familiares com orçamento e mesada
          </li>
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/app"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--nu-accent)] px-8 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            Abrir app
          </Link>
        </div>
      </main>
    </div>
  );
}
