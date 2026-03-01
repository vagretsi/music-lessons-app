import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bio, bioEl, instruments, experience, isActive } = await req.json();

  const teacher = await prisma.teacherProfile.update({
    where: { id: params.id },
    data: {
      bio: bio ?? undefined,
      bioEl: bioEl ?? undefined,
      instruments: instruments ?? undefined,
      experience: experience !== undefined ? parseInt(experience) : undefined,
      isActive: isActive ?? undefined,
    },
  });

  return NextResponse.json(teacher);
}
