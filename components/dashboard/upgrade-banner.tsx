"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeBannerProps {
  show: boolean;
}

export function UpgradeBanner({ show }: UpgradeBannerProps) {
  if (!show) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm font-medium">
            You&apos;re approaching your usage limit
          </p>
          <p className="text-xs text-muted-foreground">
            Upgrade to Pro for 100x more requests.
          </p>
        </div>
      </div>
      <Button asChild size="sm">
        <Link href="/billing">Upgrade</Link>
      </Button>
    </div>
  );
}
