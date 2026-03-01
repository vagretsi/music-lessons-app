import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { instrument, duration, mood, notes } = await req.json();

  if (!instrument || !duration) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const log = await prisma.practiceLog.create({
    data: {
      userId: session.user.id,
      instrument,
      duration: parseInt(duration),
      mood: mood ? parseInt(mood) : null,
      notes: notes || null,
    },
  });

  return NextResponse.json(log, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const logs = await prisma.practiceLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 50,
  });

  return NextResponse.json(logs);
}
