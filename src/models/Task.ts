import mongoose, { Schema, models, model, type Document } from "mongoose";

export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "done";

export interface ITask extends Document {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  completed: boolean;
  dueDate?: Date;
  userId: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
    // Better Auth's Mongo adapter stores user _id as a string, so we index
    // on a plain string field rather than an ObjectId ref to keep the two
    // systems decoupled.
    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Task model may already exist on Next.js hot-reload; reuse if so.
export const Task = models.Task || model<ITask>("Task", TaskSchema);
