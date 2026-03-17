"use client";

import { Progress } from "@/components/ui/progress";

interface UsageMeterProps {
  current: number;
  limit: number;
  label?: string;
}

export function UsageMeter({
  current,
  limit,
  label = "Requests used",
}: UsageMeterProps) {
  const percentage = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {current} / {limit === -1 ? "Unlimited" : limit}
        </span>
      </div>
      {limit > 0 && <Progress value={percentage} className="h-2" />}
    </div>
  );
}
