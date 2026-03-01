import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/booking/BookingForm";

export default async function BookingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [subscription, teachers] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: session.user.id } }),
    prisma.teacherProfile.findMany({
      where: { isActive: true },
      include: {
        user: { select: { name: true, image: true } },
        availability: { where: { isActive: true } },
      },
    }),
  ]);

  const tier = subscription?.tier ?? "PRELUDE";

  if (tier === "PRELUDE") {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="font-display text-4xl text-cream mb-4">Upgrade to Book Sessions</p>
          <p className="text-cream/50 mb-8">
            Live 1-on-1 sessions are available on Sonata and Symphony plans.
          </p>
          <a href="/pricing" className="btn-primary">View Plans</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Sessions</p>
          <h1 className="font-display text-4xl text-cream">Book a Live Session</h1>
          <p className="text-cream/40 mt-2">Choose a teacher and schedule your 1-on-1 session.</p>
        </div>

        <BookingForm teachers={teachers as any} userId={session.user.id} />
      </div>
    </div>
  );
}
