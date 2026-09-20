import { TIME_ZONE } from "@/lib/availability";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Video, Calendar } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      progress: { include: { lesson: true }, take: 5, orderBy: { updatedAt: "desc" } },
      bookings: {
        where: { scheduledAt: { gte: new Date() }, status: "CONFIRMED" },
        take: 3,
        orderBy: { scheduledAt: "asc" },
        include: { teacher: { select: { name: true } } },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {user.role === "TEACHER" && <div className="card-dark mb-8 flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl">Η διαθεσιμότητά μου</h2><p className="mt-2 text-sm text-cream/60">Όρισε τις ημέρες και ώρες που διδάσκεις.</p></div><Link href="/availability" className="btn-primary">Ρύθμιση ωραρίου</Link></div>}
        {/* Header */}
        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Ο χώρος μου</p>
            <h1 className="font-display text-4xl text-cream">
              Καλώς ήρθες, {user.name?.split(" ")[0] ?? "μουσικέ"}
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Lessons */}
          <div className="card-dark">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-cream">Τα μαθήματά σου</h2>
              <Link href="/lessons" className="text-gold/60 hover:text-gold text-xs tracking-widest uppercase transition-colors">
                Όλα τα μαθήματα →
              </Link>
            </div>
            {user.progress.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-cream/30 mb-4">Το πρώτο σου μάθημα σε περιμένει.</p>
                <Link href="/lessons" className="btn-secondary text-sm py-2 px-4">
                  Δες τα μαθήματα
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
                      <p className="text-cream/40 text-xs">{p.completed ? "Ολοκληρώθηκε" : "Σε εξέλιξη"}</p>
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
              <h2 className="font-display text-xl text-cream">Οι επόμενες κρατήσεις σου</h2>
              <Link href="/booking" className="text-gold/60 hover:text-gold text-xs tracking-widest uppercase transition-colors">
                Νέα κράτηση →
              </Link>
            </div>
            {user.bookings.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-cream/30 mb-4">Δεν έχεις προγραμματισμένο μάθημα.</p>
                <Link href="/booking" className="btn-secondary text-sm py-2 px-4">
                  Κλείσε μάθημα
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
                      <p className="text-cream text-sm">Με {booking.teacher.name}</p>
                      <p className="text-cream/40 text-xs">
                        {new Date(booking.scheduledAt).toLocaleDateString("el-GR", { timeZone: TIME_ZONE, hour12: false,
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


      </div>
    </div>
  );
}
