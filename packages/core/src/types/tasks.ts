export type TaskPriority = 1 | 2 | 3 | 4;

export type FamilyTask = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  done: boolean;
  priority: TaskPriority;
  dueDate: string;
  section: string;
  createdAt: string;
  completedAt: string | null;
};

export type TaskStore = {
  version: 1;
  tasks: FamilyTask[];
  sections: string[];
};

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  1: "#dc2626",
  2: "#f59e0b",
  3: "#2563eb",
  4: "#9ca3af",
};
