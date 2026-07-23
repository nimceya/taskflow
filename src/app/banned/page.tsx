"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ShieldBan } from "lucide-react";

export default function BannedPage() {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <ShieldBan className="h-10 w-10 text-destructive" />
      <h1 className="text-2xl font-semibold">Your account has been suspended</h1>
      <p className="text-muted-foreground max-w-md">
        You no longer have access to TaskFlow. If you think this is a
        mistake, contact your administrator.
      </p>
      <Button onClick={handleLogout}>Log out</Button>
    </main>
  );
}
