import { listUsers } from "@/actions/admin-actions";
import { UsersTable } from "@/features/admin/users-table";

export default async function AdminUsersPage() {
  const users = await listUsers();

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-muted-foreground text-sm">
          {users.length} registered user{users.length === 1 ? "" : "s"}.
        </p>
      </div>

      <UsersTable users={users} />
    </main>
  );
}
