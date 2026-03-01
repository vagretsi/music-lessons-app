import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Lock, Play, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function LessonsPage() {
  const session = await getServerSession(authOptions);

  const [lessons, subscription] = await Promise.all([
    prisma.lesson.findMany({
      where: { status: "PUBLISHED" },
      include: { teacher: { include: { user: { select: { name: true } } } } },
      orderBy: [{ tier: "asc" }, { order: "asc" }],
    }),
    session
      ? prisma.subscription.findUnique({ where: { userId: session.user.id } })
      : null,
  ]);

  const userTier = subscription?.tier ?? "PRELUDE";
  const tierOrder = { PRELUDE: 0, SONATA: 1, SYMPHONY: 2 };

  function canAccess(lessonTier: string) {
    return tierOrder[userTier as keyof typeof tierOrder] >= tierOrder[lessonTier as keyof typeof tierOrder];
  }

  const instruments = [...new Set(lessons.map((l) => l.instrument).filter(Boolean))];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Learn</p>
          <h1 className="font-display text-5xl text-cream mb-3">Video Lessons</h1>
          <p className="text-cream/40">
            {lessons.length} lessons across all instruments and levels.
          </p>
        </div>

        {/* Lessons Grid */}
        {lessons.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-cream/30 text-lg">No lessons published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => {
              const accessible = canAccess(lesson.tier);
              return (
                <div
                  key={lesson.id}
                  className={cn(
                    "card-dark group relative flex flex-col",
                    !accessible && "opacity-70"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-ink-100 border border-gold/10 mb-4 overflow-hidden">
                    {lesson.thumbnailUrl ? (
                      <img src={lesson.thumbnailUrl} alt={lesson.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 border border-gold/30 flex items-center justify-center">
                          <Play size={20} className="text-gold ml-1" />
                        </div>
                      </div>
                    )}
                    {!accessible && (
                      <div className="absolute inset-0 bg-ink/70 flex flex-col items-center justify-center gap-2">
                        <Lock size={20} className="text-gold/60" />
                        <span className="text-cream/60 text-xs tracking-widest uppercase">
                          {lesson.tier === "SONATA" ? "Sonata+" : "Symphony"}
                        </span>
                      </div>
                    )}
                    {lesson.duration && (
                      <div className="absolute bottom-2 right-2 bg-ink/80 px-2 py-1 flex items-center gap-1">
                        <Clock size={10} className="text-gold" />
                        <span className="text-cream/80 text-xs">{lesson.duration} min</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {lesson.instrument && (
                        <span className="text-gold/60 text-xs tracking-widest uppercase">{lesson.instrument}</span>
                      )}
                      {lesson.level && (
                        <>
                          <span className="text-gold/30">·</span>
                          <span className="text-cream/40 text-xs capitalize">{lesson.level}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-display text-lg text-cream mb-2 leading-snug">{lesson.title}</h3>
                    {lesson.description && (
                      <p className="text-cream/40 text-sm line-clamp-2 mb-3">{lesson.description}</p>
                    )}
                    <p className="text-cream/30 text-xs">By {lesson.teacher.user.name}</p>
                  </div>

                  <div className="mt-4">
                    {accessible ? (
                      <Link href={`/lessons/${lesson.id}`} className="btn-secondary w-full text-center text-sm py-2">
                        Watch Lesson
                      </Link>
                    ) : (
                      <Link href="/pricing" className="btn-primary w-full text-center text-sm py-2">
                        Upgrade to Access
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
