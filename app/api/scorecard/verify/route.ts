import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id." },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ paid: false });
    }

    const scorecard = await db.scorecard.findUnique({
      where: { sessionId },
    });

    if (!scorecard) {
      return NextResponse.json(
        { error: "Scorecard not found." },
        { status: 404 }
      );
    }

    if (!scorecard.paid) {
      await db.scorecard.update({
        where: { id: scorecard.id },
        data: { paid: true },
      });
    }

    return NextResponse.json({
      paid: true,
      result: scorecard.result,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Verification failed." },
      { status: 500 }
    );
  }
}
