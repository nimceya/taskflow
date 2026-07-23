import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Task } from "@/models/Task";
import { taskSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

// GET /api/tasks/:id
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid task id" }, { status: 400 });
  }

  try {
    await connectDB();
    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Ownership check: a user may never read another user's task.
    if (task.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("GET /api/tasks/:id error:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/:id
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid task id" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = taskSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const existing = await Task.findById(id);

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates = {
      ...parsed.data,
      ...(parsed.data.dueDate
        ? { dueDate: new Date(parsed.data.dueDate) }
        : {}),
    };

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/tasks/:id error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid task id" }, { status: 400 });
  }

  try {
    await connectDB();
    const existing = await Task.findById(id);

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Task.findByIdAndDelete(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/tasks/:id error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
