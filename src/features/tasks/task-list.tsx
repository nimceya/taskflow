"use client";

import { useMemo } from "react";
import type { Task } from "@/types/task";
import { useTaskStore } from "@/store/task-store";
import { TaskCard } from "@/features/tasks/task-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Inbox } from "lucide-react";

export function TaskList({ tasks }: { tasks: Task[] }) {
  const { search, priorityFilter, statusFilter, setSearch, setPriorityFilter, setStatusFilter } =
    useTaskStore();

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, search, priorityFilter, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={priorityFilter}
          onValueChange={(v) => setPriorityFilter(v as typeof priorityFilter)}
        >
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        >
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="todo">To do</SelectItem>
            <SelectItem value="in-progress">In progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
          <Inbox className="h-10 w-10" />
          <p className="font-medium">No tasks found</p>
          <p className="text-sm">
            {tasks.length === 0
              ? "Create your first task to get started."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
