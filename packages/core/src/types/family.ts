export type MemberRole = "tutor" | "child" | "other";

export type FamilyMember = {
  id: string;
  name: string;
  role: MemberRole;
  birthDate: string;
  avatar: string;
  color: string;
  createdAt: string;
};

export type Family = {
  id: string;
  name: string;
  createdAt: string;
};

export type FamilyStore = {
  version: 1;
  family: Family | null;
  members: FamilyMember[];
};

export const MEMBER_ROLES: { id: MemberRole; label: string; description: string }[] = [
  { id: "tutor", label: "Tutor", description: "Pai, mãe ou responsável" },
  { id: "child", label: "Filho(a)", description: "Criança ou adolescente" },
  { id: "other", label: "Outro", description: "Avó, tio, etc." },
];

export const AVATAR_OPTIONS = [
  "👩", "👨", "👧", "👦", "👶", "🧓", "👵", "👴",
  "🧑", "👱", "🧔", "👩‍🦰", "👨‍🦱", "👩‍🦳", "🧑‍🦲",
];

export const COLOR_OPTIONS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
  "#8b5cf6", "#ec4899", "#06b6d4", "#f97316",
];
