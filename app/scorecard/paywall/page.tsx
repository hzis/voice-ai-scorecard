"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2, Loader2 } from "lucide-react";

const STORAGE_KEY = "scorecard-answers";

function getStoredAnswers(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function PaywallPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const answers = getStoredAnswers();
    if (Object.keys(answers).length < 15) {
      router.replace("/scorecard/step/1");
    }
  }, [router]);

  if (!mounted) return null;

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    // Timeout: show error after 15s if still spinning
    const timeout = setTimeout(() => {
      setLoading(false);
      setError("Checkout is taking too long. Please try again.");
    }, 15000);
    try {
      const answers = getStoredAnswers();
      const res = await fetch("/api/scorecard/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      clearTimeout(timeout);
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Unable to start checkout. Please try again.");
        setLoading(false);
      }
    } catch {
      clearTimeout(timeout);
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Lock Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-8 w-8 text-primary" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Your Score Is Ready</h1>
          <p className="mt-2 text-muted-foreground">
            Unlock your full Voice AI readiness report.
          </p>
        </div>

        {/* Blurred score preview */}
        <div className="relative overflow-hidden rounded-xl border bg-muted/30 p-8">
          <div className="select-none blur-md">
            <div className="text-6xl font-bold text-primary">72</div>
            <div className="mt-2 text-lg font-medium">Ready</div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        {/* What they get */}
        <div className="space-y-3 text-left">
          <p className="text-sm font-medium text-muted-foreground">
            What&apos;s included for $19:
          </p>
          {[
            "Your 0-100 readiness score",
            "4-dimension category breakdown",
            "Top 5 personalized recommendations",
            "ROI estimate for your business",
            "Downloadable PDF report",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="w-full text-base"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting to checkout...
            </>
          ) : (
            "Unlock My Score — $19"
          )}
        </Button>

        {error && (
          <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          One-time payment. 7-day money-back guarantee.
        </p>
      </div>
    </div>
  );
}
