import { prisma } from "@/lib/prisma";
import { Users, Video, Calendar, CreditCard, TrendingUp } from "lucide-react";

export default async function AdminPage() {
  const [
    totalUsers,
    totalLessons,
    totalBookings,
    activeSubscriptions,
    recentUsers,
    recentBookings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.lesson.count(),
    prisma.booking.count(),
    prisma.subscription.count({ where: { status: "ACTIVE", tier: { not: "PRELUDE" } } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        student: { select: { name: true } },
        teacher: { select: { name: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-gold" },
    { label: "Total Lessons", value: totalLessons, icon: Video, color: "text-gold" },
    { label: "Total Bookings", value: totalBookings, icon: Calendar, color: "text-gold" },
    { label: "Paid Subscribers", value: activeSubscriptions, icon: CreditCard, color: "text-gold" },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Admin</p>
        <h1 className="font-display text-4xl text-cream">Overview</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="card-dark">
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={18} className={stat.color} />
              <TrendingUp size={14} className="text-cream/20" />
            </div>
            <p className="font-display text-4xl text-cream mb-1">{stat.value}</p>
            <p className="text-cream/40 text-xs tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card-dark">
          <h2 className="font-display text-xl text-cream mb-5">Recent Users</h2>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-3 border border-gold/10">
                <div className="w-8 h-8 bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-cream text-sm truncate">{user.name}</p>
                  <p className="text-cream/40 text-xs truncate">{user.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 border ${
                  user.role === "ADMIN" ? "border-gold/50 text-gold" :
                  user.role === "TEACHER" ? "border-blue-400/50 text-blue-400" :
                  "border-cream/20 text-cream/40"
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card-dark">
          <h2 className="font-display text-xl text-cream mb-5">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <p className="text-cream/30 text-center py-8">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-3 p-3 border border-gold/10">
                  <div className="flex-1 min-w-0">
                    <p className="text-cream text-sm">{booking.student.name} → {booking.teacher.name}</p>
                    <p className="text-cream/40 text-xs">
                      {new Date(booking.scheduledAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 border ${
                    booking.status === "CONFIRMED" ? "border-green-400/50 text-green-400" :
                    booking.status === "COMPLETED" ? "border-gold/50 text-gold" :
                    booking.status === "CANCELED" ? "border-red-400/50 text-red-400" :
                    "border-cream/20 text-cream/40"
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
