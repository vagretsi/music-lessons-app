import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { instrument, description } = await req.json();

  if (!instrument || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check subscription allows AI feedback
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const tier = subscription?.tier ?? "PRELUDE";

  if (tier === "PRELUDE") {
    return NextResponse.json({ error: "Upgrade to Sonata or Symphony for AI feedback." }, { status: 403 });
  }

  // Check monthly usage for Sonata (limit: 5)
  if (tier === "SONATA") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const count = await prisma.aIFeedback.count({
      where: { userId: session.user.id, createdAt: { gte: startOfMonth } },
    });

    if (count >= 5) {
      return NextResponse.json({
        error: "You've reached your 5 AI feedback sessions for this month. Upgrade to Symphony for unlimited access.",
      }, { status: 429 });
    }
  }

  // Call OpenAI
  const prompt = `You are an expert music teacher providing professional feedback to a student.

Instrument: ${instrument}
Student's description: ${description}

Please provide specific, actionable, encouraging feedback. Cover:
1. What they're likely doing well
2. The specific issue they mentioned and why it happens
3. 2-3 concrete exercises or techniques to improve
4. A motivational closing note

Be conversational, warm, and specific. Avoid generic advice.`;

  const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    }),
  });

  if (!openAIRes.ok) {
    console.error("OpenAI error:", await openAIRes.text());
    return NextResponse.json({ error: "AI service temporarily unavailable." }, { status: 502 });
  }

  const openAIData = await openAIRes.json();
  const feedback = openAIData.choices[0].message.content;

  // Save feedback
  await prisma.aIFeedback.create({
    data: {
      userId: session.user.id,
      instrument,
      transcript: description,
      feedback,
    },
  });

  return NextResponse.json({ feedback });
}
