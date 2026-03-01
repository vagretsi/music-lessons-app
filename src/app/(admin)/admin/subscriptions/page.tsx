import { prisma } from "@/lib/prisma";
import { CreditCard } from "lucide-react";

export default async function AdminSubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    orderBy: { updatedAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const tierColor: Record<string, string> = {
    SYMPHONY: "border-gold/50 text-gold",
    SONATA: "border-blue-400/50 text-blue-400",
    PRELUDE: "border-cream/20 text-cream/40",
  };

  const statusColor: Record<string, string> = {
    ACTIVE: "border-green-400/50 text-green-400",
    CANCELED: "border-red-400/50 text-red-400",
    PAST_DUE: "border-yellow-400/50 text-yellow-400",
    INACTIVE: "border-cream/20 text-cream/30",
    TRIALING: "border-blue-400/50 text-blue-400",
  };

  const paid = subscriptions.filter((s) => s.tier !== "PRELUDE" && s.status === "ACTIVE");
  const total = subscriptions.length;

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Admin</p>
          <h1 className="font-display text-4xl text-cream">Subscriptions</h1>
        </div>
        <div className="text-right">
          <p className="text-cream/40 text-sm">{total} total · <span className="text-gold">{paid.length} paid</span></p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Prelude (Free)", value: subscriptions.filter((s) => s.tier === "PRELUDE").length, color: "text-cream" },
          { label: "Sonata", value: subscriptions.filter((s) => s.tier === "SONATA" && s.status === "ACTIVE").length, color: "text-blue-400" },
          { label: "Symphony", value: subscriptions.filter((s) => s.tier === "SYMPHONY" && s.status === "ACTIVE").length, color: "text-gold" },
        ].map((stat) => (
          <div key={stat.label} className="card-dark text-center">
            <p className={`font-display text-4xl mb-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-cream/40 text-xs tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      {subscriptions.length === 0 ? (
        <div className="card-dark text-center py-20">
          <CreditCard size={40} className="text-gold/30 mx-auto mb-4" />
          <p className="text-cream/40">No subscriptions yet.</p>
        </div>
      ) : (
        <div className="card-dark p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">User</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Tier</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Status</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Renews</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Stripe ID</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-cream text-sm">{sub.user.name}</p>
                    <p className="text-cream/40 text-xs">{sub.user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 border ${tierColor[sub.tier] ?? ""}`}>
                      {sub.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 border ${statusColor[sub.status] ?? ""}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-cream/40 text-xs">
                    {sub.currentPeriodEnd
                      ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-cream/30 text-xs font-mono truncate max-w-[150px]">
                    {sub.stripeSubscriptionId ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
