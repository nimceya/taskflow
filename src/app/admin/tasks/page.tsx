import { listAllTasks } from "@/actions/admin-actions";
import { AllTasksTable } from "@/features/admin/all-tasks-table";

export default async function AdminTasksPage() {
  const tasks = await listAllTasks();

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">All tasks</h1>
        <p className="text-muted-foreground text-sm">
          Every task across every account — {tasks.length} total.
        </p>
      </div>

      <AllTasksTable tasks={tasks} />
    </main>
  );
}
