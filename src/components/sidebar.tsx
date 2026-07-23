import Link from "next/link";
import { headers } from "next/headers";
import { CheckCircle2, LayoutDashboard, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";

export async function Sidebar() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r bg-card px-4 py-6">
      <Link href="/" className="flex items-center gap-2 px-2 mb-8">
        <CheckCircle2 className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">TaskFlow</span>
      </Link>

      <nav className="flex flex-col gap-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-accent text-accent-foreground"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        {role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Link>
        )}
      </nav>
    </aside>
  );
}
