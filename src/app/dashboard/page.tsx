import { Suspense } from "react";
import { getMyTasks } from "@/actions/task-actions";
import { DashboardStats } from "@/features/tasks/dashboard-stats";
import { TaskList } from "@/features/tasks/task-list";
import { TaskForm } from "@/features/tasks/task-form";
import type { Task } from "@/types/task";

async function TasksSection() {
  const tasks: Task[] = await getMyTasks();

  return (
    <>
      <DashboardStats tasks={tasks} />
      <TaskList tasks={tasks} />
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl border bg-card animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl border bg-card animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Here&apos;s what&apos;s on your plate.
          </p>
        </div>
        <TaskForm />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <TasksSection />
      </Suspense>
    </main>
  );
}
