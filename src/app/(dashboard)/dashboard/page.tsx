import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Video, Calendar, Clock, Flame } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      progress: { include: { lesson: true }, take: 5, orderBy: { updatedAt: "desc" } },
      bookings: {
        where: { scheduledAt: { gte: new Date() }, status: "CONFIRMED" },
        take: 3,
        orderBy: { scheduledAt: "asc" },
        include: { teacher: { select: { name: true } } },
      },
      practiceLog: { take: 7, orderBy: { date: "desc" } },
    },
  });

  if (!user) redirect("/login");

  const totalPracticeMinutes = user.practiceLog.reduce((sum, log) => sum + log.duration, 0);
  const completedLessons = user.progress.filter((p) => p.completed).length;
  const tier = user.subscription?.tier ?? "PRELUDE";

  const stats = [
    { label: "Lessons Watched", value: user.progress.length, icon: Video, color: "text-gold" },
    { label: "Practice Minutes", value: totalPracticeMinutes, icon: Clock, color: "text-gold" },
    { label: "Upcoming Sessions", value: user.bookings.length, icon: Calendar, color: "text-gold" },
    { label: "Completed", value: completedLessons, icon: Flame, color: "text-gold" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Dashboard</p>
            <h1 className="font-display text-4xl text-cream">
              Welcome back, {user.name?.split(" ")[0] ?? "Musician"}
            </h1>
          </div>
          <div className="flex items-center gap-2 border border-gold/30 px-4 py-2">
            <span className="text-gold text-xs tracking-widest uppercase">Plan:</span>
            <span className="text-cream font-display text-sm">
              {tier === "PRELUDE" ? "Prelude" : tier === "SONATA" ? "Sonata" : "Symphony"}
            </span>
            {tier === "PRELUDE" && (
              <Link href="/pricing" className="ml-2 text-xs text-gold/60 hover:text-gold transition-colors underline underline-offset-2">
                Upgrade
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="card-dark">
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={18} className={stat.color} />
              </div>
              <p className="font-display text-4xl text-cream mb-1">{stat.value}</p>
              <p className="text-cream/40 text-xs tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Lessons */}
          <div className="card-dark">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-cream">Continue Learning</h2>
              <Link href="/lessons" className="text-gold/60 hover:text-gold text-xs tracking-widest uppercase transition-colors">
                View All →
              </Link>
            </div>
            {user.progress.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-cream/30 mb-4">No lessons started yet.</p>
                <Link href="/lessons" className="btn-secondary text-sm py-2 px-4">
                  Browse Lessons
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {user.progress.map((p) => (
                  <Link
                    key={p.id}
                    href={`/lessons/${p.lesson.id}`}
                    className="flex items-center gap-4 p-3 border border-gold/10 hover:border-gold/30 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      <Video size={14} className="text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-cream text-sm truncate">{p.lesson.title}</p>
                      <p className="text-cream/40 text-xs">{p.completed ? "Completed" : "In progress"}</p>
                    </div>
                    {p.completed && <span className="w-2 h-2 rounded-full bg-gold shrink-0" />}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Bookings */}
          <div className="card-dark">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-cream">Upcoming Sessions</h2>
              <Link href="/booking" className="text-gold/60 hover:text-gold text-xs tracking-widest uppercase transition-colors">
                Book New →
              </Link>
            </div>
            {user.bookings.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-cream/30 mb-4">No upcoming sessions.</p>
                <Link href="/booking" className="btn-secondary text-sm py-2 px-4">
                  Book a Session
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {user.bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-3 border border-gold/10">
                    <div className="w-10 h-10 bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      <Calendar size={14} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-cream text-sm">with {booking.teacher.name}</p>
                      <p className="text-cream/40 text-xs">
                        {new Date(booking.scheduledAt).toLocaleDateString("en-GB", {
                          weekday: "short", day: "numeric", month: "short",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/lessons", label: "Browse Lessons" },
            { href: "/booking", label: "Book a Session" },
            { href: "/progress", label: "Log Practice" },
            { href: "/ai-feedback", label: "AI Feedback" },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="btn-secondary text-center text-sm py-3">
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
