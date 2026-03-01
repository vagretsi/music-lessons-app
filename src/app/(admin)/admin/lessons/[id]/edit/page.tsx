import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { LessonForm } from "@/components/admin/LessonForm";

export default async function EditLessonPage({ params }: { params: { id: string } }) {
  const [lesson, teachers] = await Promise.all([
    prisma.lesson.findUnique({ where: { id: params.id } }),
    prisma.teacherProfile.findMany({ include: { user: { select: { name: true } } } }),
  ]);

  if (!lesson) notFound();

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Admin → Lessons</p>
        <h1 className="font-display text-4xl text-cream">Edit Lesson</h1>
      </div>
      <LessonForm teachers={teachers as any} lesson={lesson as any} />
    </div>
  );
}
