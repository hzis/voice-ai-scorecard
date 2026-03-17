import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createPortalSession } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account" },
      { status: 400 },
    );
  }

  const session = await createPortalSession({
    customerId: user.stripeCustomerId,
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  });

  return NextResponse.json({ url: session.url });
}
