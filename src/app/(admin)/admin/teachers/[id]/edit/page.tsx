import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TeacherEditForm } from "@/components/admin/TeacherEditForm";

export default async function EditTeacherPage({ params }: { params: { id: string } }) {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
      availability: true,
    },
  });

  if (!teacher) notFound();

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Admin → Teachers</p>
        <h1 className="font-display text-4xl text-cream">Edit Teacher</h1>
        <p className="text-cream/40 mt-1">{teacher.user.name}</p>
      </div>
      <TeacherEditForm teacher={teacher as any} />
    </div>
  );
}
