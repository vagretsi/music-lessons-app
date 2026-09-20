import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { availabilitySchema } from "@/lib/availability";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (user?.role !== "TEACHER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = availabilitySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid availability" }, { status: 400 });
  await prisma.$transaction(async tx => {
    const profile = await tx.teacherProfile.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, instruments: [] },
      update: {},
    });
    await tx.availability.deleteMany({ where: { teacherId: profile.id } });
    if (parsed.data.length) await tx.availability.createMany({ data: parsed.data.map(slot => ({ ...slot, teacherId: profile.id })) });
  });
  return NextResponse.json({ success: true });
}
