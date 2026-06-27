import Link from "next/link";

const features = [
  {
    icon: "💭",
    title: "Check-in emocional",
    desc: "Cada membro regista como se sente — o resumo familiar mostra o pulso da casa.",
  },
  {
    icon: "📅",
    title: "Calendário familiar",
    desc: "Eventos por categorias com cores, responsáveis e alertas de conflito.",
  },
  {
    icon: "🎯",
    title: "Missões e tarefas",
    desc: "Atribui responsabilidades com prioridade, prazo e acompanhamento.",
  },
  {
    icon: "💰",
    title: "Finanças familiares",
    desc: "Orçamento, mesada digital, importação de extratos e balanço patrimonial.",
  },
  {
    icon: "💕",
    title: "Mural de afeto",
    desc: "Agradece, reconhece e celebra — corações que fortalecem os laços.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Gestão de membros",
    desc: "Perfis com papéis (tutor, filho), avatares e cores personalizadas.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--nu-bg)] text-[var(--nu-ink)]">
      {/* Hero */}
      <header className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 pb-8 pt-20 text-center sm:pt-28">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--nu-accent)] text-2xl font-bold text-white shadow-lg">
          F
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Famelii
        </h1>
        <p className="mt-2 text-lg font-medium text-[var(--nu-accent-strong)]">
          The heart of your family.
        </p>
        <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--nu-muted)]">
          Rotina, humor, finanças e afeto — tudo o que a tua família precisa,
          num só sítio. Simples, bonito e feito com carinho.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--nu-accent)] px-8 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            Começar agora
          </Link>
          <a
            href="#features"
            className="inline-flex h-12 items-center justify-center rounded-xl border px-8 text-sm font-semibold text-[var(--nu-muted)] transition hover:bg-[var(--nu-bg-elevated)] hover:text-[var(--nu-ink)]"
          >
            Ver funcionalidades
          </a>
        </div>
      </header>

      {/* Features */}
      <section
        id="features"
        className="mx-auto w-full max-w-4xl px-6 py-16"
      >
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Tudo para a tua família
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-[var(--nu-muted)]">
          Cada módulo foi pensado para simplificar o dia-a-dia familiar — do
          humor às finanças, das tarefas ao afeto.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-[var(--nu-bg-card)] p-6 transition-all hover:scale-[1.02]"
              style={{ boxShadow: "var(--nu-shadow)" }}
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--nu-muted)]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-20 pt-8 text-center">
        <div
          className="rounded-3xl bg-[var(--nu-bg-card)] px-8 py-12"
          style={{ boxShadow: "var(--nu-shadow-lg)" }}
        >
          <p className="text-4xl">💛</p>
          <h2 className="mt-4 text-2xl font-bold">Pronto para começar?</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--nu-muted)]">
            Cria a tua família em segundos. Gratuito, sem anúncios, sem
            complicações.
          </p>
          <Link
            href="/auth"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[var(--nu-accent)] px-8 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            Criar a minha família
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-xs text-[var(--nu-muted)]">
        <p>Famelii — The heart of your family.</p>
      </footer>
    </div>
  );
}
