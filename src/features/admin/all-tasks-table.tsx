"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { AdminTaskView } from "@/actions/admin-actions";
import { deleteTaskAsAdmin } from "@/actions/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const priorityVariant = {
  low: "secondary",
  medium: "warning",
  high: "destructive",
} as const;

export function AllTasksTable({ tasks }: { tasks: AdminTaskView[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(taskId: string) {
    startTransition(async () => {
      try {
        await deleteTaskAsAdmin(taskId);
        toast.success("Task deleted");
      } catch {
        toast.error("Could not delete task");
      }
    });
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="p-3 font-medium">Title</th>
            <th className="p-3 font-medium">Owner</th>
            <th className="p-3 font-medium">Priority</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-t">
              <td className="p-3">{task.title}</td>
              <td className="p-3 text-muted-foreground">{task.userEmail}</td>
              <td className="p-3">
                <Badge variant={priorityVariant[task.priority as keyof typeof priorityVariant]}>
                  {task.priority}
                </Badge>
              </td>
              <td className="p-3">
                <Badge variant="outline">{task.status}</Badge>
              </td>
              <td className="p-3 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  onClick={() => handleDelete(task._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tasks.length === 0 && (
        <p className="p-6 text-center text-muted-foreground text-sm">
          No tasks yet across any account.
        </p>
      )}
    </div>
  );
}
