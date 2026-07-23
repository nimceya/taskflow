import type { Task } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { ListTodo, CheckCircle2, Clock, Flame } from "lucide-react";

export function DashboardStats({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter(
    (t) => t.priority === "high" && !t.completed
  ).length;

  const stats = [
    { label: "Total tasks", value: total, icon: ListTodo },
    { label: "Completed", value: completed, icon: CheckCircle2 },
    { label: "Pending", value: pending, icon: Clock },
    { label: "High priority", value: highPriority, icon: Flame },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
            <stat.icon className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
