"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { api, Task } from "@/lib/api";
import { clearAuth, getToken, getUsername } from "@/lib/auth";
import Column from "@/components/Column";
import NewTaskForm from "@/components/NewTaskForm";

const COLUMNS: { id: Task["status"]; title: string }[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

export default function BoardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadTasks() {
    try {
      setTasks(await api.listTasks());
    } catch (err) {
      setError("Could not load tasks. Try logging in again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(title: string, description: string) {
    const task = await api.createTask(title, description);
    setTasks((prev) => [...prev, task]);
  }

  async function handleDelete(id: number) {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id as Task["status"];
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update - flip the UI immediately, roll back on failure
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await api.updateTask(taskId, {
        title: task.title,
        description: task.description,
        status: newStatus,
      });
    } catch (err) {
      // Roll back on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t))
      );
      setError("Could not update task status.");
    }
  }

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Loading your board...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">TaskFlow</h1>
          <p className="text-sm text-slate-500">Signed in as {getUsername()}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Log out
        </button>
      </div>

      <NewTaskForm onCreate={handleCreate} />

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasks.filter((t) => t.status === col.id)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
