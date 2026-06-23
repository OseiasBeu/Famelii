export type EventCategory =
  | "escola"
  | "saude"
  | "lazer"
  | "trabalho"
  | "familia"
  | "financas"
  | "outro";

export const EVENT_CATEGORIES: {
  id: EventCategory;
  label: string;
  color: string;
}[] = [
  { id: "escola", label: "Escola", color: "#3b82f6" },
  { id: "saude", label: "Saúde", color: "#ef4444" },
  { id: "lazer", label: "Lazer", color: "#a855f7" },
  { id: "trabalho", label: "Trabalho", color: "#f59e0b" },
  { id: "familia", label: "Família", color: "#10b981" },
  { id: "financas", label: "Finanças", color: "#6366f1" },
  { id: "outro", label: "Outro", color: "#6b7280" },
];

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  dateLocal: string;
  timeStart: string;
  timeEnd: string;
  category: EventCategory;
  assignee: string;
  recurring: "none" | "daily" | "weekly" | "monthly";
  createdAt: string;
};

export type CalendarStore = {
  version: 1;
  events: CalendarEvent[];
};
