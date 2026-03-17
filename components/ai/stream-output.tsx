"use client";

import { cn } from "@/lib/utils";

interface StreamOutputProps {
  text: string;
  isStreaming: boolean;
  className?: string;
}

export function StreamOutput({ text, isStreaming, className }: StreamOutputProps) {
  if (!text && !isStreaming) return null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/50 p-4 text-sm whitespace-pre-wrap",
        className,
      )}
    >
      {text}
      {isStreaming && (
        <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-foreground" />
      )}
    </div>
  );
}
