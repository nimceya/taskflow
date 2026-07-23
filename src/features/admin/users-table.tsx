"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { AdminUserView } from "@/actions/admin-actions";
import { setUserBanned, deleteUser } from "@/actions/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Ban, ShieldCheck, Trash2 } from "lucide-react";

export function UsersTable({ users }: { users: AdminUserView[] }) {
  const [isPending, startTransition] = useTransition();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleToggleBan(userId: string, currentlyBanned: boolean) {
    startTransition(async () => {
      try {
        await setUserBanned(userId, !currentlyBanned);
        toast.success(currentlyBanned ? "User unbanned" : "User banned");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not update user"
        );
      }
    });
  }

  function handleDelete(userId: string) {
    startTransition(async () => {
      try {
        await deleteUser(userId);
        toast.success("User deleted");
        setConfirmDeleteId(null);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not delete user"
        );
      }
    });
  }

  const userToDelete = users.find((u) => u.id === confirmDeleteId);

  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="p-3 font-medium">Name</th>
            <th className="p-3 font-medium">Email</th>
            <th className="p-3 font-medium">Role</th>
            <th className="p-3 font-medium">Tasks</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-3">{user.name || "—"}</td>
              <td className="p-3 text-muted-foreground">{user.email}</td>
              <td className="p-3">
                <Badge variant={user.role === "admin" ? "default" : "outline"}>
                  {user.role}
                </Badge>
              </td>
              <td className="p-3">{user.taskCount}</td>
              <td className="p-3">
                {user.banned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="success">Active</Badge>
                )}
              </td>
              <td className="p-3">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    onClick={() => handleToggleBan(user.id, user.banned)}
                    title={user.banned ? "Unban user" : "Ban user"}
                  >
                    {user.banned ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <Ban className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    onClick={() => setConfirmDeleteId(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog
        open={Boolean(confirmDeleteId)}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this user?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {userToDelete?.email} and all of their tasks will be permanently
            deleted. This can&apos;t be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
