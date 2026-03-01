import { prisma } from "@/lib/prisma";
import { Calendar } from "lucide-react";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { scheduledAt: "desc" },
    include: {
      student: { select: { name: true, email: true } },
      teacher: { select: { name: true } },
    },
  });

  const statusColor: Record<string, string> = {
    CONFIRMED: "border-green-400/50 text-green-400",
    COMPLETED: "border-gold/50 text-gold",
    CANCELED: "border-red-400/50 text-red-400",
    PENDING: "border-cream/20 text-cream/40",
  };

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Admin</p>
          <h1 className="font-display text-4xl text-cream">Bookings</h1>
        </div>
        <p className="text-cream/40 text-sm">{bookings.length} total bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="card-dark text-center py-20">
          <Calendar size={40} className="text-gold/30 mx-auto mb-4" />
          <p className="font-display text-2xl text-cream mb-2">No bookings yet</p>
          <p className="text-cream/40">Bookings will appear here once students start scheduling sessions.</p>
        </div>
      ) : (
        <div className="card-dark p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Student</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Teacher</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Date & Time</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Duration</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-cream text-sm">{booking.student.name}</p>
                    <p className="text-cream/40 text-xs">{booking.student.email}</p>
                  </td>
                  <td className="px-6 py-4 text-cream/60 text-sm">{booking.teacher.name}</td>
                  <td className="px-6 py-4 text-cream/60 text-sm">
                    {new Date(booking.scheduledAt).toLocaleDateString("en-GB", {
                      weekday: "short", day: "numeric", month: "short", year: "numeric",
                    })}
                    <span className="block text-cream/30 text-xs">
                      {new Date(booking.scheduledAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-cream/60 text-sm">{booking.duration} min</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 border ${statusColor[booking.status] ?? "border-cream/20 text-cream/40"}`}>
                      {booking.status}
                    </span>
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
