"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { auth, db } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Task } from "@/models/Task";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }
  // `role` comes from the additionalFields config in lib/auth.ts.
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    throw new Error("Forbidden: admin access only");
  }
  return session;
}

export interface AdminUserView {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: string;
  taskCount: number;
}

export async function listUsers(): Promise<AdminUserView[]> {
  await requireAdmin();

  const users = await db.collection("user").find({}).toArray();

  await connectDB();
  const counts = await Task.aggregate([
    { $group: { _id: "$userId", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [c._id, c.count]));

  return users.map((u) => ({
    id: u._id.toString(),
    name: u.name ?? "",
    email: u.email ?? "",
    role: u.role ?? "user",
    banned: Boolean(u.banned),
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : "",
    taskCount: countMap.get(u._id.toString()) ?? 0,
  }));
}

export async function setUserBanned(userId: string, banned: boolean) {
  const session = await requireAdmin();

  if (userId === session.user.id) {
    throw new Error("You can't ban your own account");
  }

  await db
    .collection("user")
    .updateOne({ _id: new ObjectId(userId) }, { $set: { banned } });

  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  const session = await requireAdmin();

  if (userId === session.user.id) {
    throw new Error("You can't delete your own account");
  }

  // Clean up everything tied to this user: their Better Auth records
  // (account, session) and their tasks, then the user document itself.
  await db.collection("account").deleteMany({ userId });
  await db.collection("session").deleteMany({ userId });

  await connectDB();
  await Task.deleteMany({ userId });

  await db.collection("user").deleteOne({ _id: new ObjectId(userId) });

  revalidatePath("/admin/users");
}

export interface AdminTaskView {
  _id: string;
  title: string;
  priority: string;
  status: string;
  completed: boolean;
  dueDate?: string;
  userId: string;
  userEmail: string;
  createdAt: string;
}

export async function listAllTasks(): Promise<AdminTaskView[]> {
  await requireAdmin();

  await connectDB();
  const tasks = await Task.find({}).sort({ createdAt: -1 });

  const users = await db.collection("user").find({}).toArray();
  const emailMap = new Map(users.map((u) => [u._id.toString(), u.email]));

  return tasks.map((t) => ({
    _id: t._id.toString(),
    title: t.title,
    priority: t.priority,
    status: t.status,
    completed: t.completed,
    dueDate: t.dueDate ? t.dueDate.toISOString() : undefined,
    userId: t.userId,
    userEmail: emailMap.get(t.userId) ?? "unknown",
    createdAt: t.createdAt.toISOString(),
  }));
}

export async function deleteTaskAsAdmin(taskId: string) {
  await requireAdmin();

  await connectDB();
  await Task.findByIdAndDelete(taskId);

  revalidatePath("/admin/tasks");
}
