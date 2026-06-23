/** Identificadores estáveis para armazenamento e futura API. */
export type MoodId =
  | "happy"
  | "ok"
  | "neutral"
  | "sad"
  | "angry"
  | "skip";

/** Alinhado ao brief: privacidade do check-in. */
export type CheckInPrivacy = "all" | "emoji_only" | "parents_only" | "hidden";

export type EmotionalCheckIn = {
  dateLocal: string;
  mood: MoodId;
  note: string;
  privacy: CheckInPrivacy;
  updatedAt: string;
};

export const MOOD_OPTIONS: {
  id: MoodId;
  emoji: string;
  label: string;
}[] = [
  { id: "happy", emoji: "😄", label: "Feliz" },
  { id: "ok", emoji: "🙂", label: "Bem" },
  { id: "neutral", emoji: "😐", label: "Neutro" },
  { id: "sad", emoji: "😞", label: "Triste" },
  { id: "angry", emoji: "😤", label: "Irritado" },
  { id: "skip", emoji: "🙈", label: "Prefiro não dizer" },
];

export const PRIVACY_OPTIONS: {
  value: CheckInPrivacy;
  label: string;
  hint: string;
}[] = [
  { value: "all", label: "Partilhar tudo", hint: "Emoji e nota com a família" },
  {
    value: "emoji_only",
    label: "Só o emoji",
    hint: "A nota fica só contigo",
  },
  {
    value: "parents_only",
    label: "Só com os pais",
    hint: "Tutores veem; resto vê só o permitido pelo resumo",
  },
  {
    value: "hidden",
    label: "Ocultar detalhes",
    hint: "Mínimo no resumo familiar (conforme regras do produto)",
  },
];
