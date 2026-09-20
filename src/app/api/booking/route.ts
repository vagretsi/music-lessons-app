import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAvailable } from "@/lib/availability";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { teacherId, scheduledAt, notes } = await req.json().catch(() => ({}));

  if (typeof teacherId !== "string" || typeof scheduledAt !== "string") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const start = new Date(scheduledAt);
  if (!Number.isFinite(start.getTime()) || start.getTime() <= Date.now()) {
    return NextResponse.json({ error: "Invalid booking time" }, { status: 400 });
  }

  // Check subscription allows booking
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription || subscription.tier === "PRELUDE") {
    return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
  }

  // Check teacher exists
  const teacher = await prisma.teacherProfile.findUnique({ where: { id: teacherId }, include: { availability: { where: { isActive: true } } } });
  if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

  if (!teacher.isActive || !isAvailable(start, teacher.availability)) {
    return NextResponse.json({ error: "This time is outside the teacher availability." }, { status: 409 });
  }

  // Check overlapping sessions, including bookings made before an hours change.
  const existing = await prisma.booking.findMany({
    where: {
      teacherId: teacher.userId,
      scheduledAt: { lt: new Date(start.getTime() + 60 * 60 * 1000) },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  if (existing.some(booking => booking.scheduledAt.getTime() + booking.duration * 60000 > start.getTime())) {
    return NextResponse.json({ error: "This slot is already booked." }, { status: 409 });
  }

  const booking = await prisma.booking.create({
    data: {
      studentId: session.user.id,
      teacherId: teacher.userId,
      scheduledAt: new Date(scheduledAt),
      notes: notes || null,
      status: "CONFIRMED",
    },
  });

  return NextResponse.json(booking, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    where: { studentId: session.user.id },
    include: { teacher: { select: { name: true } } },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json(bookings);
}
