export type MissionPriority = "low" | "medium" | "high";
export type MissionStatus = "todo" | "in_progress" | "done";

export type Mission = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: MissionPriority;
  status: MissionStatus;
  dueDate: string;
  category: string;
  createdAt: string;
  completedAt: string | null;
};

export const MISSION_PRIORITIES: {
  id: MissionPriority;
  label: string;
  emoji: string;
}[] = [
  { id: "low", label: "Baixa", emoji: "🟢" },
  { id: "medium", label: "Média", emoji: "🟡" },
  { id: "high", label: "Alta", emoji: "🔴" },
];

export const MISSION_STATUSES: {
  id: MissionStatus;
  label: string;
}[] = [
  { id: "todo", label: "A fazer" },
  { id: "in_progress", label: "Em curso" },
  { id: "done", label: "Concluída" },
];

export type MissionStore = {
  version: 1;
  missions: Mission[];
};
