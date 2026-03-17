import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createStream } from "@/lib/ai";
import { db } from "@/lib/db";

const LIMITS = { free: 10, pro: 1000 };

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const limit = user.plan === "pro" ? LIMITS.pro : LIMITS.free;
  if (limit > 0 && user.usageCount >= limit) {
    return NextResponse.json(
      { error: "Usage limit reached. Please upgrade." },
      { status: 429 },
    );
  }

  const { prompt, systemPrompt, model } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt required" }, { status: 400 });
  }

  await db.user.update({
    where: { id: user.id },
    data: { usageCount: { increment: 1 } },
  });

  const stream = await createStream({ prompt, systemPrompt, model });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          controller.enqueue(encoder.encode(content));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
