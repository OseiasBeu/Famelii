import { TasksPanel } from "@/components/tasks-panel";

export const metadata = {
  title: "Tarefas — Famelii",
};

export default function TarefasPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold tracking-tight">Tarefas</h1>
      <TasksPanel />
    </div>
  );
}
