"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AVATAR_OPTIONS,
  COLOR_OPTIONS,
  MEMBER_ROLES,
  type Family,
  type FamilyMember,
  type MemberRole,
} from "@famelii/core";
import {
  addMember,
  getFamily,
  listMembers,
  removeMember,
  updateFamilyName,
  updateMember,
} from "@/lib/storage/family";

const card = "rounded-2xl bg-[var(--nu-bg-card)] p-5";
const shadow = { boxShadow: "var(--nu-shadow)" } as const;
const input = "w-full rounded-xl border bg-[var(--nu-bg)] px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[var(--nu-accent)]/40";
const btnPrimary = "rounded-xl bg-[var(--nu-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110";

export function FamilyPanel() {
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [ready, setReady] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState<MemberRole>("child");
  const [birthDate, setBirthDate] = useState("");
  const [avatar, setAvatar] = useState("🧑");
  const [color, setColor] = useState("#3b82f6");

  const refresh = useCallback(async () => {
    const [f, m] = await Promise.all([getFamily(), listMembers()]);
    setFamily(f);
    setMembers(m);
    if (f) setFamilyName(f.name);
  }, []);

  useEffect(() => { refresh().finally(() => setReady(true)); }, [refresh]);

  async function handleSaveName() {
    if (!familyName.trim()) return;
    await updateFamilyName(familyName);
    setEditingName(false);
    await refresh();
  }

  async function handleAdd() {
    if (!name.trim()) return;
    await addMember({ name, role, birthDate, avatar, color });
    setName(""); setBirthDate(""); setShowAdd(false);
    await refresh();
  }

  if (!ready) return <p className="text-sm text-[var(--nu-muted)]">A carregar…</p>;

  if (!family) {
    return <p className="text-sm text-[var(--nu-muted)]">Nenhuma família configurada.</p>;
  }

  const tutors = members.filter((m) => m.role === "tutor");
  const children = members.filter((m) => m.role === "child");
  const others = members.filter((m) => m.role === "other");

  return (
    <div className="flex flex-col gap-6">
      {/* Family name */}
      <div className={card} style={shadow}>
        {editingName ? (
          <div className="flex gap-2">
            <input value={familyName} onChange={(e) => setFamilyName(e.target.value)} className={`${input} flex-1`} autoFocus onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); }} />
            <button type="button" onClick={handleSaveName} className={btnPrimary}>Guardar</button>
            <button type="button" onClick={() => { setEditingName(false); setFamilyName(family.name); }} className="text-sm text-[var(--nu-muted)]">Cancelar</button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{family.name}</h2>
              <p className="text-sm text-[var(--nu-muted)]">{members.length} membro{members.length !== 1 ? "s" : ""}</p>
            </div>
            <button type="button" onClick={() => setEditingName(true)} className="text-sm text-[var(--nu-accent)] hover:underline">Editar</button>
          </div>
        )}
      </div>

      {/* Members by role */}
      {([
        { label: "Tutores", items: tutors },
        { label: "Filhos", items: children },
        { label: "Outros", items: others },
      ] as const).filter((g) => g.items.length > 0).map((group) => (
        <div key={group.label}>
          <h3 className="mb-2 text-sm font-semibold text-[var(--nu-muted)]">{group.label}</h3>
          <div className="space-y-2">
            {group.items.map((m) => (
              <MemberCard key={m.id} member={m} onRefresh={refresh} />
            ))}
          </div>
        </div>
      ))}

      {/* Add member */}
      {showAdd ? (
        <div className={card} style={shadow}>
          <h3 className="mb-4 font-semibold">Novo membro</h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--nu-muted)]">Avatar</label>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {AVATAR_OPTIONS.map((a) => (
                  <button key={a} type="button" onClick={() => setAvatar(a)} className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${avatar === a ? "ring-2 ring-[var(--nu-accent)] bg-[var(--nu-accent-soft)]" : "bg-[var(--nu-bg-elevated)]"}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--nu-muted)]">Cor</label>
              <div className="mt-1 flex gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button key={c} type="button" onClick={() => setColor(c)} className={`h-7 w-7 rounded-full ${color === c ? "ring-2 ring-offset-2 ring-[var(--nu-accent)]" : ""}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} className={input} autoFocus />
            <div className="flex gap-2">
              {MEMBER_ROLES.map((r) => (
                <button key={r.id} type="button" onClick={() => setRole(r.id)} className={`flex-1 rounded-xl border px-2 py-2 text-center text-xs font-medium transition ${role === r.id ? "border-[var(--nu-accent)] bg-[var(--nu-accent-soft)] text-[var(--nu-accent-strong)]" : "text-[var(--nu-muted)]"}`}>
                  {r.label}
                </button>
              ))}
            </div>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={input} />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 rounded-xl border py-2.5 text-sm font-medium text-[var(--nu-muted)]">Cancelar</button>
              <button type="button" onClick={handleAdd} disabled={!name.trim()} className={`${btnPrimary} flex-1 disabled:opacity-40`}>Adicionar</button>
            </div>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setShowAdd(true)} className="rounded-xl border border-dashed py-3 text-sm font-medium text-[var(--nu-muted)] transition hover:border-[var(--nu-accent)] hover:text-[var(--nu-accent)]">
          + Adicionar membro
        </button>
      )}
    </div>
  );
}

function MemberCard({ member, onRefresh }: { member: FamilyMember; onRefresh: () => void }) {
  const roleLabel = MEMBER_ROLES.find((r) => r.id === member.role)?.label ?? member.role;

  const age = member.birthDate ? (() => {
    const today = new Date();
    const birth = new Date(member.birthDate);
    let a = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) a--;
    return a;
  })() : null;

  return (
    <div className="group flex items-center gap-3 rounded-2xl bg-[var(--nu-bg-card)] px-4 py-3" style={{ boxShadow: "var(--nu-shadow)" }}>
      <span className="flex h-11 w-11 items-center justify-center rounded-full text-2xl" style={{ backgroundColor: `${member.color}18` }}>
        {member.avatar}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{member.name}</p>
        <p className="text-xs text-[var(--nu-muted)]">
          {roleLabel}
          {age !== null && ` · ${age} anos`}
        </p>
      </div>
      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: member.color }} title="Cor do membro" />
      <button
        type="button"
        onClick={() => removeMember(member.id).then(onRefresh)}
        className="text-xs text-[var(--nu-muted)] opacity-0 transition hover:text-[var(--nu-danger)] group-hover:opacity-100"
      >
        Remover
      </button>
    </div>
  );
}
