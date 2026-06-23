import { EmotionalCheckInForm } from "@/components/emotional-check-in-form";

export const metadata = {
  title: "Check-in — Famelii",
};

export default function CheckInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Check-in emocional</h1>
        <p className="mt-2 text-sm text-[var(--nu-muted)]">
          Primeira funcionalidade em desenvolvimento. Depois sincronizamos com a
          conta e o resumo familiar.
        </p>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white/70 p-6 dark:border-white/15 dark:bg-white/5">
        <EmotionalCheckInForm />
      </div>
    </div>
  );
}
