import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const searchParams = req.nextUrl.searchParams;
  const tier = searchParams.get("tier") as "SONATA" | "SYMPHONY" | null;
  const billing = searchParams.get("billing") as "monthly" | "yearly" | null;

  if (!tier || !billing || !PLANS[tier]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const plan = PLANS[tier];
  const priceId = plan.priceId[billing];

  if (!priceId) {
    return NextResponse.json({ error: "Price not configured" }, { status: 400 });
  }

  // Get or create Stripe customer
  let customerId: string | undefined;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (user?.stripeCustomerId) {
    customerId = user.stripeCustomerId;
  } else {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      name: session.user.name ?? undefined,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=1`,
    metadata: { userId: session.user.id, tier, billing },
  });

  return NextResponse.redirect(checkoutSession.url!);
}
