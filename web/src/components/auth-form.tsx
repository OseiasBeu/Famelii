"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig, isSupabaseConfigured } from "@famelii/core";

type Mode = "login" | "register" | "forgot";

const input = "w-full rounded-xl border bg-[var(--nu-bg)] px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[var(--nu-accent)]/40";
const btnPrimary = "w-full rounded-xl bg-[var(--nu-accent)] py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-40";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isSupabaseConfigured()) {
    return (
      <div className="text-center">
        <p className="text-sm text-[var(--nu-muted)]">
          Supabase não está configurado. Continua a usar o app com dados locais.
        </p>
        <a href="/app" className="mt-4 inline-block text-sm font-medium text-[var(--nu-accent)] hover:underline">
          Ir para o app
        </a>
      </div>
    );
  }

  const { url, anonKey } = getSupabasePublicConfig();
  const supabase = createBrowserClient(url, anonKey);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href = "/app";
    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) setError(error.message);
    else setMessage("Verifica o teu email para confirmar o registo.");
    setLoading(false);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setMessage("Email de recuperação enviado.");
    setLoading(false);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="text-center">
        <span className="flex mx-auto h-14 w-14 items-center justify-center rounded-2xl bg-[var(--nu-accent)] text-xl font-bold text-white shadow-sm">F</span>
        <h1 className="mt-4 text-2xl font-bold">
          {mode === "login" && "Entrar no Famelii"}
          {mode === "register" && "Criar conta"}
          {mode === "forgot" && "Recuperar senha"}
        </h1>
        <p className="mt-1 text-sm text-[var(--nu-muted)]">The heart of your family.</p>
      </div>

      <form
        onSubmit={mode === "login" ? handleLogin : mode === "register" ? handleRegister : handleForgot}
        className="w-full space-y-4 rounded-2xl bg-[var(--nu-bg-card)] p-6"
        style={{ boxShadow: "var(--nu-shadow)" }}
      >
        {mode === "register" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--nu-muted)]">Nome</label>
            <input placeholder="O teu nome" value={name} onChange={(e) => setName(e.target.value)} className={input} required />
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--nu-muted)]">Email</label>
          <input type="email" placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} className={input} required />
        </div>
        {mode !== "forgot" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--nu-muted)]">Senha</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={input} required minLength={6} />
          </div>
        )}

        {error && <p className="text-sm text-[var(--nu-danger)]">{error}</p>}
        {message && <p className="text-sm text-[var(--nu-success)]">{message}</p>}

        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? "A processar…" :
            mode === "login" ? "Entrar" :
            mode === "register" ? "Criar conta" :
            "Enviar email"}
        </button>

        <div className="flex flex-col gap-2 pt-2 text-center text-xs">
          {mode === "login" && (
            <>
              <button type="button" onClick={() => { setMode("register"); setError(""); setMessage(""); }} className="text-[var(--nu-accent)] hover:underline">
                Não tens conta? Criar agora
              </button>
              <button type="button" onClick={() => { setMode("forgot"); setError(""); setMessage(""); }} className="text-[var(--nu-muted)] hover:underline">
                Esqueceste a senha?
              </button>
            </>
          )}
          {mode === "register" && (
            <button type="button" onClick={() => { setMode("login"); setError(""); setMessage(""); }} className="text-[var(--nu-accent)] hover:underline">
              Já tens conta? Entrar
            </button>
          )}
          {mode === "forgot" && (
            <button type="button" onClick={() => { setMode("login"); setError(""); setMessage(""); }} className="text-[var(--nu-accent)] hover:underline">
              Voltar ao login
            </button>
          )}
        </div>
      </form>

      <a href="/app" className="text-xs text-[var(--nu-muted)] hover:underline">
        Continuar sem conta (dados locais)
      </a>
    </div>
  );
}
