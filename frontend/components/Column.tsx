"use client";

import { useDroppable } from "@dnd-kit/core";
import { Task } from "@/lib/api";
import TaskCard from "./TaskCard";

export default function Column({
  id,
  title,
  tasks,
  onDelete,
}: {
  id: Task["status"];
  title: string;
  tasks: Task[];
  onDelete: (id: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[400px] w-full flex-col gap-2 rounded-xl border p-3 transition-colors ${
        isOver ? "border-slate-400 bg-slate-100" : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
          {tasks.length}
        </span>
      </div>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={onDelete} />
      ))}

      {tasks.length === 0 && (
        <p className="mt-2 text-center text-xs text-slate-400">No tasks</p>
      )}
    </div>
  );
}
