import { prisma } from "@/lib/prisma";
import { LessonForm } from "@/components/admin/LessonForm";

export default async function NewLessonPage() {
  const teachers = await prisma.teacherProfile.findMany({
    include: { user: { select: { name: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Admin → Lessons</p>
        <h1 className="font-display text-4xl text-cream">New Lesson</h1>
      </div>
      <LessonForm teachers={teachers as any} />
    </div>
  );
}
