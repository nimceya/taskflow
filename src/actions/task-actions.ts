"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Task } from "@/models/Task";
import { taskSchema, type TaskInput } from "@/lib/validations";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createTask(input: TaskInput) {
  const session = await requireSession();
  const parsed = taskSchema.parse(input);

  await connectDB();
  await Task.create({
    ...parsed,
    dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined,
    completed: parsed.status === "done",
    userId: session.user.id,
  });

  revalidatePath("/dashboard");
}

export async function updateTask(id: string, input: Partial<TaskInput>) {
  const session = await requireSession();
  const parsed = taskSchema.partial().parse(input);

  await connectDB();
  const existing = await Task.findById(id);
  if (!existing) throw new Error("Task not found");
  if (existing.userId !== session.user.id) throw new Error("Forbidden");

  await Task.findByIdAndUpdate(id, {
    ...parsed,
    ...(parsed.dueDate ? { dueDate: new Date(parsed.dueDate) } : {}),
    // Keep the checkbox and the status dropdown in sync: if the edit form
    // changed the status, derive `completed` from it rather than leaving
    // the two out of sync (e.g. status "done" but checkbox unchecked).
    ...(parsed.status ? { completed: parsed.status === "done" } : {}),
  });

  revalidatePath("/dashboard");
}

export async function toggleTaskCompleted(id: string, completed: boolean) {
  const session = await requireSession();

  await connectDB();
  const existing = await Task.findById(id);
  if (!existing) throw new Error("Task not found");
  if (existing.userId !== session.user.id) throw new Error("Forbidden");

  await Task.findByIdAndUpdate(id, {
    completed,
    status: completed ? "done" : "todo",
  });

  revalidatePath("/dashboard");
}

export async function deleteTask(id: string) {
  const session = await requireSession();

  await connectDB();
  const existing = await Task.findById(id);
  if (!existing) throw new Error("Task not found");
  if (existing.userId !== session.user.id) throw new Error("Forbidden");

  await Task.findByIdAndDelete(id);

  revalidatePath("/dashboard");
}

export async function getMyTasks() {
  const session = await requireSession();

  await connectDB();
  const tasks = await Task.find({ userId: session.user.id }).sort({
    createdAt: -1,
  });

  return JSON.parse(JSON.stringify(tasks));
}
