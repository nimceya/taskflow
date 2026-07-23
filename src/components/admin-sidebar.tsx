import Link from "next/link";
import { CheckCircle2, LayoutDashboard, Users, ListChecks } from "lucide-react";

export function AdminSidebar() {
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r bg-card px-4 py-6">
      <Link href="/" className="flex items-center gap-2 px-2 mb-8">
        <CheckCircle2 className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">TaskFlow</span>
      </Link>

      <p className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground">
        Admin
      </p>

      <nav className="flex flex-col gap-1">
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <LayoutDashboard className="h-4 w-4" />
          Overview
        </Link>
        <Link
          href="/admin/users"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <Users className="h-4 w-4" />
          Users
        </Link>
        <Link
          href="/admin/tasks"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <ListChecks className="h-4 w-4" />
          All tasks
        </Link>
      </nav>

      <div className="mt-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          ← Back to my dashboard
        </Link>
      </div>
    </aside>
  );
}
