import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, tier } = await req.json();

  await prisma.subscription.upsert({
    where: { userId },
    create: { userId, tier, status: "ACTIVE" },
    update: { tier, status: "ACTIVE" },
  });

  return NextResponse.json({ success: true });
}