import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role;

  // Any authenticated user can reach /dashboard, but only an admin gets
  // past this check. A non-admin who tries to visit /admin directly is
  // sent back to their own dashboard rather than shown a 403 — simpler
  // for a small app, and avoids confirming to a regular user that an
  // /admin route even exists.
  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
