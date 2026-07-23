"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Task } from "@/types/task";
import { toggleTaskCompleted, deleteTask } from "@/actions/task-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/features/tasks/task-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const priorityVariant = {
  low: "secondary",
  medium: "warning",
  high: "destructive",
} as const;

export function TaskCard({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleToggle() {
    startTransition(async () => {
      try {
        await toggleTaskCompleted(task._id, !task.completed);
      } catch {
        toast.error("Could not update task");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteTask(task._id);
        toast.success("Task deleted");
        setConfirmOpen(false);
      } catch {
        toast.error("Could not delete task");
      }
    });
  }

  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          disabled={isPending}
          className="mt-1 h-4 w-4 rounded border-input"
        />

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium truncate",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant={priorityVariant[task.priority]}>
              {task.priority}
            </Badge>
            <Badge variant="outline">{task.status}</Badge>
            {task.dueDate && (
              <span className="text-xs text-muted-foreground">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <TaskForm
            task={task}
            trigger={
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this task?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            &ldquo;{task.title}&rdquo; will be permanently deleted. This
            can&apos;t be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
