"use client";

import { useState } from "react";
import {
  AVATAR_OPTIONS,
  COLOR_OPTIONS,
  MEMBER_ROLES,
  type MemberRole,
} from "@famelii/core";
import { addMember, createFamily, linkCurrentUserToMember } from "@/lib/storage/family";

const card = "rounded-2xl bg-[var(--nu-bg-card)] p-6";
const shadow = { boxShadow: "var(--nu-shadow)" } as const;
const input = "w-full rounded-xl border bg-[var(--nu-bg)] px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[var(--nu-accent)]/40";
const btnPrimary = "rounded-xl bg-[var(--nu-accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110";

type PendingMember = {
  name: string;
  email: string;
  role: MemberRole;
  birthDate: string;
  avatar: string;
  color: string;
};

export function FamilySetup({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<"family" | "members" | "adding">("family");
  const [familyName, setFamilyName] = useState("");
  const [members, setMembers] = useState<PendingMember[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("tutor");
  const [birthDate, setBirthDate] = useState("");
  const [avatar, setAvatar] = useState("👩");
  const [color, setColor] = useState("#3b82f6");

  function resetMemberForm() {
    setName("");
    setRole(members.length === 0 ? "tutor" : "child");
    setBirthDate("");
    setAvatar(members.length % 2 === 0 ? "👩" : "👨");
    setColor(COLOR_OPTIONS[(members.length + 1) % COLOR_OPTIONS.length]);
  }

  function handleAddMember() {
    if (!name.trim()) return;
    setMembers([...members, { name: name.trim(), email: email.trim(), role, birthDate, avatar, color }]);
    setEmail("");
    resetMemberForm();
    setStep("members");
  }

  async function handleFinish() {
    if (!familyName.trim() || members.length === 0) return;
    await createFamily(familyName);
    let firstMemberId: string | null = null;
    for (let i = 0; i < members.length; i++) {
      const created = await addMember(members[i]);
      if (i === 0) firstMemberId = created.id;
    }
    if (firstMemberId) {
      await linkCurrentUserToMember(firstMemberId);
    }
    onComplete();
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-8 py-12">
      <div className="text-center">
        <span className="flex mx-auto h-16 w-16 items-center justify-center rounded-3xl bg-[var(--nu-accent)] text-2xl font-bold text-white shadow-sm">F</span>
        <h1 className="mt-4 text-2xl font-bold">Bem-vindo ao Famelii</h1>
        <p className="mt-1 text-sm text-[var(--nu-muted)]">The heart of your family.</p>
      </div>

      {step === "family" && (
        <div className={card} style={{ ...shadow, width: "100%" }}>
          <h2 className="text-base font-semibold">Como se chama a tua família?</h2>
          <p className="mt-1 text-sm text-[var(--nu-muted)]">Ex: "Família Silva", "Casa da Avó", "Os Pereiras"</p>
          <input
            autoFocus
            placeholder="Nome da família"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && familyName.trim()) setStep("members"); }}
            className={`${input} mt-4`}
          />
          <button
            type="button"
            onClick={() => setStep("members")}
            disabled={!familyName.trim()}
            className={`${btnPrimary} mt-4 w-full disabled:opacity-40`}
          >
            Continuar
          </button>
        </div>
      )}

      {step === "members" && (
        <div className={card} style={{ ...shadow, width: "100%" }}>
          <h2 className="text-base font-semibold">Quem faz parte da família?</h2>
          <p className="mt-1 text-sm text-[var(--nu-muted)]">Adiciona pelo menos um membro para começar.</p>

          {members.length > 0 && (
            <ul className="mt-4 space-y-2">
              {members.map((m, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl bg-[var(--nu-bg-elevated)] px-3 py-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full text-lg" style={{ backgroundColor: `${m.color}20` }}>
                    {m.avatar}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-[var(--nu-muted)]">{MEMBER_ROLES.find((r) => r.id === m.role)?.label}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMembers(members.filter((_, j) => j !== i))}
                    className="text-xs text-[var(--nu-danger)] hover:underline"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => { resetMemberForm(); setStep("adding"); }} className="flex-1 rounded-xl border border-dashed py-3 text-sm font-medium text-[var(--nu-muted)] transition hover:border-[var(--nu-accent)] hover:text-[var(--nu-accent)]">
              + Adicionar membro
            </button>
          </div>

          {members.length > 0 && (
            <button type="button" onClick={handleFinish} className={`${btnPrimary} mt-4 w-full`}>
              Começar a usar o Famelii
            </button>
          )}
        </div>
      )}

      {step === "adding" && (
        <div className={card} style={{ ...shadow, width: "100%" }}>
          <h2 className="text-base font-semibold">Novo membro</h2>

          <div className="mt-4 flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-[var(--nu-muted)]">Avatar</label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {AVATAR_OPTIONS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition ${
                      avatar === a ? "ring-2 ring-[var(--nu-accent)] bg-[var(--nu-accent-soft)]" : "bg-[var(--nu-bg-elevated)] hover:bg-[var(--nu-bg)]"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--nu-muted)]">Cor</label>
              <div className="mt-1.5 flex gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full transition ${color === c ? "ring-2 ring-offset-2 ring-[var(--nu-accent)]" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} className={input} autoFocus />
            <input type="email" placeholder="Email (para login — opcional)" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />

            <div>
              <label className="text-xs font-medium text-[var(--nu-muted)]">Papel na família</label>
              <div className="mt-1.5 flex gap-2">
                {MEMBER_ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex-1 rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition ${
                      role === r.id
                        ? "border-[var(--nu-accent)] bg-[var(--nu-accent-soft)] text-[var(--nu-accent-strong)]"
                        : "bg-[var(--nu-bg)] text-[var(--nu-muted)] hover:bg-[var(--nu-bg-elevated)]"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={input} />

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep("members")} className="flex-1 rounded-xl border py-2.5 text-sm font-medium text-[var(--nu-muted)] transition hover:bg-[var(--nu-bg-elevated)]">
                Cancelar
              </button>
              <button type="button" onClick={handleAddMember} disabled={!name.trim()} className={`${btnPrimary} flex-1 disabled:opacity-40`}>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
