import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, bio, bioEl, instruments, experience, availability } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User is required." }, { status: 400 });
  }

  // Update user role to TEACHER
  await prisma.user.update({ where: { id: userId }, data: { role: "TEACHER" } });

  const teacher = await prisma.teacherProfile.create({
    data: {
      userId,
      bio: bio || null,
      bioEl: bioEl || null,
      instruments: instruments || [],
      experience: experience ? parseInt(experience) : null,
      availability: {
        create: (availability || []).map((a: { dayOfWeek: number; startTime: string; endTime: string }) => ({
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
        })),
      },
    },
  });

  return NextResponse.json(teacher, { status: 201 });
}
