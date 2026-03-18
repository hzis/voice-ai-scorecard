import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { calculateScore } from "@/lib/scoring";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { answers } = (await req.json()) as {
      answers: Record<string, number>;
    };

    if (!answers || Object.keys(answers).length < 15) {
      return NextResponse.json(
        { error: "All 15 questions must be answered." },
        { status: 400 }
      );
    }

    const result = calculateScore(answers);

    // Create Stripe session first (no DB dependency)
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: siteConfig.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: absoluteUrl(
        `/scorecard/results?session_id={CHECKOUT_SESSION_ID}`
      ),
      cancel_url: absoluteUrl("/scorecard/paywall"),
      metadata: {
        answers: JSON.stringify(answers),
        result: JSON.stringify(result),
      },
    });

    // Single DB write — no prepared statement conflict with pgBouncer
    await db.scorecard.create({
      data: {
        sessionId: session.id,
        answers: answers as Prisma.InputJsonValue,
        result: result as unknown as Prisma.InputJsonValue,
        paid: false,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", msg);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
