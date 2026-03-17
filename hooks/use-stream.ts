"use client";

import { useCallback, useState } from "react";

interface UseStreamOptions {
  onFinish?: (text: string) => void;
}

interface UseStreamReturn {
  output: string;
  isStreaming: boolean;
  error: string | null;
  start: (prompt: string, systemPrompt?: string) => Promise<void>;
  reset: () => void;
}

export function useStream(options?: UseStreamOptions): UseStreamReturn {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(
    async (prompt: string, systemPrompt?: string) => {
      setOutput("");
      setError(null);
      setIsStreaming(true);

      try {
        const res = await fetch("/api/ai/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, systemPrompt }),
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader available");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setOutput(accumulated);
        }

        options?.onFinish?.(accumulated);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Stream failed");
      } finally {
        setIsStreaming(false);
      }
    },
    [options],
  );

  const reset = useCallback(() => {
    setOutput("");
    setError(null);
    setIsStreaming(false);
  }, []);

  return { output, isStreaming, error, start, reset };
}
