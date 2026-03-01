import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PracticeLogForm } from "@/components/progress/PracticeLogForm";
import { Clock, Flame, CheckCircle2 } from "lucide-react";

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [practiceLogs, progress] = await Promise.all([
    prisma.practiceLog.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: 30,
    }),
    prisma.progress.findMany({
      where: { userId: session.user.id, completed: true },
    }),
  ]);

  const totalMinutes = practiceLogs.reduce((sum, log) => sum + log.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // Calculate streak (consecutive days)
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const logDates = new Set(practiceLogs.map((l) => {
    const d = new Date(l.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }));

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (logDates.has(d.getTime())) streak++;
    else if (i > 0) break;
  }

  const moodEmojis = ["😤", "😕", "😐", "🙂", "🎉"];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Progress</p>
          <h1 className="font-display text-4xl text-cream">My Progress</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="card-dark text-center">
            <Clock size={20} className="text-gold mx-auto mb-3" />
            <p className="font-display text-3xl text-cream">
              {totalHours > 0 ? `${totalHours}h ${remainingMinutes}m` : `${totalMinutes}m`}
            </p>
            <p className="text-cream/40 text-xs tracking-wide mt-1">Total Practice</p>
          </div>
          <div className="card-dark text-center">
            <Flame size={20} className="text-gold mx-auto mb-3" />
            <p className="font-display text-3xl text-cream">{streak}</p>
            <p className="text-cream/40 text-xs tracking-wide mt-1">Day Streak</p>
          </div>
          <div className="card-dark text-center">
            <CheckCircle2 size={20} className="text-gold mx-auto mb-3" />
            <p className="font-display text-3xl text-cream">{progress.length}</p>
            <p className="text-cream/40 text-xs tracking-wide mt-1">Completed Lessons</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Log Practice Form */}
          <div className="card-dark">
            <h2 className="font-display text-2xl text-cream mb-6">Log Practice Session</h2>
            <PracticeLogForm />
          </div>

          {/* Recent Logs */}
          <div className="card-dark">
            <h2 className="font-display text-2xl text-cream mb-6">Recent Sessions</h2>
            {practiceLogs.length === 0 ? (
              <p className="text-cream/30 text-center py-8">No sessions logged yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {practiceLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-3 border border-gold/10">
                    <div className="text-xl">{log.mood ? moodEmojis[log.mood - 1] : "🎵"}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-cream text-sm font-medium">{log.instrument}</span>
                        <span className="text-cream/40 text-xs">·</span>
                        <span className="text-cream/40 text-xs">{log.duration} min</span>
                      </div>
                      {log.notes && (
                        <p className="text-cream/40 text-xs mt-1 truncate">{log.notes}</p>
                      )}
                    </div>
                    <div className="text-cream/30 text-xs">
                      {new Date(log.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
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
