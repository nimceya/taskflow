import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Belt-and-suspenders: middleware already redirects unauthenticated
  // requests away from /dashboard using the fast cookie check, but this
  // Server Component re-verifies the real session before rendering
  // anything, since middleware alone should never be the sole gate on
  // sensitive data.
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  if ((session.user as { banned?: boolean }).banned) {
    redirect("/banned");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
