export type Heart = {
  id: string;
  from: string;
  to: string;
  message: string;
  emoji: string;
  dateLocal: string;
  createdAt: string;
};

export const HEART_EMOJIS: { emoji: string; label: string }[] = [
  { emoji: "❤️", label: "Amor" },
  { emoji: "🙏", label: "Gratidão" },
  { emoji: "⭐", label: "Orgulho" },
  { emoji: "🤗", label: "Abraço" },
  { emoji: "💪", label: "Força" },
  { emoji: "🎉", label: "Celebração" },
];

export type HeartsStore = {
  version: 1;
  hearts: Heart[];
};
