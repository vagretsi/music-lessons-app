import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Video, Lock, Eye, EyeOff } from "lucide-react";
import { LessonStatusToggle } from "@/components/admin/LessonStatusToggle";

export default async function AdminLessonsPage() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: "desc" },
    include: { teacher: { include: { user: { select: { name: true } } } } },
  });

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-gold/60 tracking-widest text-xs uppercase mb-1">Admin</p>
          <h1 className="font-display text-4xl text-cream">Lessons</h1>
        </div>
        <Link href="/admin/lessons/new" className="btn-primary text-sm py-2 px-5">
          <Plus size={16} /> New Lesson
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="card-dark text-center py-20">
          <Video size={40} className="text-gold/30 mx-auto mb-4" />
          <p className="font-display text-2xl text-cream mb-2">No lessons yet</p>
          <p className="text-cream/40 mb-6">Create your first lesson to get started.</p>
          <Link href="/admin/lessons/new" className="btn-primary">
            <Plus size={16} /> Create Lesson
          </Link>
        </div>
      ) : (
        <div className="card-dark p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Title</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Teacher</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Tier</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Level</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Status</th>
                <th className="text-left px-6 py-4 text-gold/60 text-xs tracking-widest uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Video size={14} className="text-gold/50 shrink-0" />
                      <span className="text-cream text-sm">{lesson.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-cream/60 text-sm">{lesson.teacher.user.name}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 border ${
                      lesson.tier === "SYMPHONY" ? "border-gold/50 text-gold" :
                      lesson.tier === "SONATA" ? "border-blue-400/50 text-blue-400" :
                      "border-cream/20 text-cream/40"
                    }`}>
                      {lesson.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-cream/60 text-xs capitalize">{lesson.level ?? "—"}</td>
                  <td className="px-6 py-4">
                    <LessonStatusToggle lessonId={lesson.id} currentStatus={lesson.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/lessons/${lesson.id}/edit`}
                      className="text-gold/60 hover:text-gold text-xs transition-colors"
                    >
                      Edit →
                    </Link>
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
