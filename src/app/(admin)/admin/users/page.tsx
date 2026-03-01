import { prisma } from "@/lib/prisma";
import { UserRoleSelect } from "@/components/admin/UserRoleSelect";
import { Users } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { subscription: true },
  });

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Admin</p>
          <h1 className="font-display text-4xl text-cream">Users</h1>
        </div>
        <p className="text-cream/40 text-sm">{users.length} total users</p>
      </div>

      <div className="card-dark p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/10">
              <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Name</th>
              <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Email</th>
              <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Plan</th>
              <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Joined</th>
              <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold shrink-0">
                      {user.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span className="text-cream text-sm">{user.name ?? "—"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-cream/60 text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 border ${
                    user.subscription?.tier === "SYMPHONY" ? "border-gold/50 text-gold" :
                    user.subscription?.tier === "SONATA" ? "border-blue-400/50 text-blue-400" :
                    "border-cream/20 text-cream/40"
                  }`}>
                    {user.subscription?.tier ?? "PRELUDE"}
                  </span>
                </td>
                <td className="px-6 py-4 text-cream/40 text-xs">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-4">
                  <UserRoleSelect userId={user.id} currentRole={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
