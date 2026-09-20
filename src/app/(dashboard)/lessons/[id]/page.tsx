import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function LessonPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const [lesson, subscription] = await Promise.all([
    prisma.lesson.findFirst({ where: { id: params.id, status: "PUBLISHED" }, include: { teacher: { include: { user: { select: { name: true } } } } } }),
    prisma.subscription.findUnique({ where: { userId: session.user.id } }),
  ]);
  if (!lesson) notFound();
  const tiers = { PRELUDE: 0, SONATA: 1, SYMPHONY: 2 };
  const accessible = tiers[subscription?.tier ?? "PRELUDE"] >= tiers[lesson.tier];
  return <div className="mx-auto max-w-4xl px-6 py-16">
    <Link href="/lessons" className="text-sm text-cream/60">← Όλα τα μαθήματα</Link>
    <h1 className="mt-8 text-3xl font-display md:text-4xl">{lesson.titleEl || lesson.title}</h1>
    <p className="mt-3 text-sm text-cream/60">{lesson.teacher.user.name}{lesson.duration ? ` · ${lesson.duration} λεπτά` : ""}</p>
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-ink-50">
      {!accessible ? <div className="p-10"><p className="mb-5">Το μάθημα περιλαμβάνεται στο πλάνο {lesson.tier === "SONATA" ? "Sonata" : "Symphony"}.</p><Link href="/pricing" className="btn-primary">Δες τα πλάνα</Link></div> : lesson.videoUrl && /^https?:\/\//i.test(lesson.videoUrl) ? <video className="aspect-video w-full" controls preload="metadata" src={lesson.videoUrl} poster={lesson.thumbnailUrl || undefined}>Ο browser σου δεν υποστηρίζει αναπαραγωγή βίντεο.</video> : <p className="p-10 text-cream/60">Το βίντεο θα είναι διαθέσιμο σύντομα.</p>}
    </div>
    {lesson.description && <p className="mt-8 whitespace-pre-line leading-relaxed text-cream/70">{lesson.descriptionEl || lesson.description}</p>}
  </div>;
}
