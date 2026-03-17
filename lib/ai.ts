import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? "",
  });
}

export async function createStream({
  prompt,
  systemPrompt = "You are a helpful assistant.",
  model = "gpt-4o-mini",
}: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
}) {
  return getOpenAI().chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    stream: true,
  });
}
