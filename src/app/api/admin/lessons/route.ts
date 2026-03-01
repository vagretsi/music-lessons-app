import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, titleEl, description, descriptionEl, videoUrl, thumbnailUrl, duration, instrument, level, tier, teacherId, order } = body;

  if (!title || !teacherId) {
    return NextResponse.json({ error: "Title and teacher are required." }, { status: 400 });
  }

  const lesson = await prisma.lesson.create({
    data: {
      title,
      titleEl: titleEl || null,
      description: description || null,
      descriptionEl: descriptionEl || null,
      videoUrl: videoUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      duration: duration || null,
      instrument: instrument || null,
      level: level || null,
      tier: tier || "PRELUDE",
      teacherId,
      order: order || 0,
      status: "DRAFT",
    },
  });

  return NextResponse.json(lesson, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: "desc" },
    include: { teacher: { include: { user: { select: { name: true } } } } },
  });

  return NextResponse.json(lessons);
}
