import { create } from "zustand";
import type { Priority, Status } from "@/types/task";

interface TaskFilterState {
  search: string;
  priorityFilter: Priority | "all";
  statusFilter: Status | "all";
  setSearch: (value: string) => void;
  setPriorityFilter: (value: Priority | "all") => void;
  setStatusFilter: (value: Status | "all") => void;
  reset: () => void;
}

/**
 * Client-only UI state (search text, active filters). This never touches
 * the server — it just controls how the task list already loaded from the
 * server is displayed/filtered in the browser.
 */
export const useTaskStore = create<TaskFilterState>((set) => ({
  search: "",
  priorityFilter: "all",
  statusFilter: "all",
  setSearch: (value) => set({ search: value }),
  setPriorityFilter: (value) => set({ priorityFilter: value }),
  setStatusFilter: (value) => set({ statusFilter: value }),
  reset: () => set({ search: "", priorityFilter: "all", statusFilter: "all" }),
}));
