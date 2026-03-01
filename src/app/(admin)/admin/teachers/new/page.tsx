import { prisma } from "@/lib/prisma";
import { TeacherForm } from "@/components/admin/TeacherForm";

export default async function NewTeacherPage() {
  const users = await prisma.user.findMany({
    where: { role: "TEACHER", teacherProfile: null },
    select: { id: true, name: true, email: true },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Admin → Teachers</p>
        <h1 className="font-display text-4xl text-cream">Add Teacher</h1>
      </div>
      <TeacherForm users={users} />
    </div>
  );
}
