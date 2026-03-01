import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, GraduationCap } from "lucide-react";

export default async function AdminTeachersPage() {
  const teachers = await prisma.teacherProfile.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { lessons: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Admin</p>
          <h1 className="font-display text-4xl text-cream">Teachers</h1>
        </div>
        <Link href="/admin/teachers/new" className="btn-primary text-sm py-2 px-5">
          <Plus size={16} /> Add Teacher
        </Link>
      </div>

      {teachers.length === 0 ? (
        <div className="card-dark text-center py-20">
          <GraduationCap size={40} className="text-gold/30 mx-auto mb-4" />
          <p className="font-display text-2xl text-cream mb-2">No teachers yet</p>
          <p className="text-cream/40 mb-6">Add your first teacher to enable bookings.</p>
          <Link href="/admin/teachers/new" className="btn-primary">
            <Plus size={16} /> Add Teacher
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="card-dark">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold">
                  {teacher.user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="text-cream font-medium">{teacher.user.name}</p>
                  <p className="text-cream/40 text-xs">{teacher.user.email}</p>
                </div>
              </div>

              {teacher.instruments.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {teacher.instruments.map((i) => (
                    <span key={i} className="text-gold/60 text-xs border border-gold/20 px-2 py-0.5">{i}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold/10">
                <span className="text-cream/40 text-xs">{teacher._count.lessons} lessons</span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 border ${teacher.isActive ? "border-green-400/50 text-green-400" : "border-red-400/50 text-red-400"}`}>
                    {teacher.isActive ? "Active" : "Inactive"}
                  </span>
                  <Link href={`/admin/teachers/${teacher.id}/edit`} className="text-gold/60 hover:text-gold text-xs transition-colors">
                    Edit →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
