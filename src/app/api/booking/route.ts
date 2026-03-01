import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { teacherId, scheduledAt, notes } = await req.json();

  if (!teacherId || !scheduledAt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check subscription allows booking
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription || subscription.tier === "PRELUDE") {
    return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
  }

  // Check teacher exists
  const teacher = await prisma.teacherProfile.findUnique({ where: { id: teacherId } });
  if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

  // Check for conflicts (same teacher, same time)
  const existing = await prisma.booking.findFirst({
    where: {
      teacherId: teacher.userId,
      scheduledAt: new Date(scheduledAt),
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  if (existing) {
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
