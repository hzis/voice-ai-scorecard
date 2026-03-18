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

    const scorecard = await db.scorecard.create({
      data: {
        answers: answers as Prisma.InputJsonValue,
        result: result as unknown as Prisma.InputJsonValue,
        paid: false,
      },
    });

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
        scorecardId: scorecard.id,
      },
    });

    await db.scorecard.update({
      where: { id: scorecard.id },
      data: { sessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", msg);
    return NextResponse.json(
      { error: "Failed to create checkout session.", detail: msg },
      { status: 500 }
    );
  }
}
