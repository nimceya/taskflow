import { listUsers, listAllTasks } from "@/actions/admin-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ListChecks, CheckCircle2, ShieldBan } from "lucide-react";

export default async function AdminOverviewPage() {
  const [users, tasks] = await Promise.all([listUsers(), listAllTasks()]);

  const bannedUsers = users.filter((u) => u.banned).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  const stats = [
    { label: "Total users", value: users.length, icon: Users },
    { label: "Total tasks", value: tasks.length, icon: ListChecks },
    { label: "Completed tasks", value: completedTasks, icon: CheckCircle2 },
    { label: "Banned users", value: bannedUsers, icon: ShieldBan },
  ];

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin overview</h1>
        <p className="text-muted-foreground text-sm">
          Platform-wide stats across all users.
        </p>
      </div>

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
    </main>
  );
}
