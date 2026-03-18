"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Mail,
  Phone,
  Loader2,
  TrendingUp,
  Send,
} from "lucide-react";
import type { ScorecardResult, Level } from "@/lib/scoring";

const levelConfig: Record<
  Level,
  { label: string; color: string; description: string }
> = {
  "not-ready": {
    label: "Not Ready",
    color: "bg-red-100 text-red-800",
    description:
      "Your business needs foundational work before deploying a voice AI agent.",
  },
  exploring: {
    label: "Exploring",
    color: "bg-yellow-100 text-yellow-800",
    description:
      "You have some pieces in place. A few improvements will unlock Voice AI for you.",
  },
  ready: {
    label: "Ready",
    color: "bg-green-100 text-green-800",
    description:
      "Your business is well-positioned to deploy a voice AI agent successfully.",
  },
  champion: {
    label: "Champion",
    color: "bg-primary/10 text-primary",
    description:
      "You're in the top tier. A voice AI agent could transform your operations immediately.",
  },
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [result, setResult] = useState<ScorecardResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.replace("/scorecard/paywall");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(
          `/api/scorecard/verify?session_id=${sessionId}`
        );
        const data = await res.json();
        if (!data.paid) {
          router.replace("/scorecard/paywall");
          return;
        }
        setResult(data.result);
      } catch {
        router.replace("/scorecard/paywall");
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [sessionId, router]);

  async function sendReport(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@") || !sessionId) return;
    setEmailSending(true);
    setEmailError(null);
    try {
      const res = await fetch("/api/scorecard/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sessionId }),
      });
      const data = await res.json();
      if (data.ok) {
        setEmailSent(true);
      } else {
        setEmailError(data.error || "Failed to send. Try again.");
      }
    } catch {
      setEmailError("Network error. Please try again.");
    } finally {
      setEmailSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const config = levelConfig[result.level];

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      {/* Score Gauge */}
      <div className="mb-12 text-center">
        <h1 className="mb-6 text-2xl font-bold">
          Your Voice AI Readiness Score
        </h1>
        <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
          <svg className="absolute inset-0" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-muted"
            />
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(result.totalScore / 100) * 553} 553`}
              strokeDashoffset="0"
              transform="rotate(-90 100 100)"
              className="text-primary transition-all duration-1000"
            />
          </svg>
          <div>
            <div className="text-5xl font-bold">{result.totalScore}</div>
            <div className="text-sm text-muted-foreground">out of 100</div>
          </div>
        </div>
        <Badge className={`mt-4 ${config.color}`}>{config.label}</Badge>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          {config.description}
        </p>
      </div>

      {/* Category Bars */}
      <div className="mb-12">
        <h2 className="mb-6 text-xl font-semibold">Category Breakdown</h2>
        <div className="space-y-4">
          {result.categories.map((cat) => (
            <div key={cat.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{cat.label}</span>
                <span className="text-muted-foreground">
                  {cat.score}/100 ({Math.round(cat.weight * 100)}% weight)
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-12">
        <h2 className="mb-6 text-xl font-semibold">Top Recommendations</h2>
        <div className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Estimate */}
      <div className="mb-12 rounded-xl border bg-muted/30 p-6">
        <div className="flex items-start gap-4">
          <TrendingUp className="mt-1 h-6 w-6 shrink-0 text-primary" />
          <div>
            <h3 className="font-semibold">ROI Estimate</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.roiEstimate}
            </p>
          </div>
        </div>
      </div>

      {/* Email Report */}
      <div className="mb-8 rounded-xl border bg-muted/20 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Get Your Full Report</h2>
        </div>
        {emailSent ? (
          <div className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            <p className="text-sm text-green-700 font-medium">
              Report sent to <strong>{email}</strong> — check your inbox!
            </p>
          </div>
        ) : (
          <form onSubmit={sendReport} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Button type="submit" disabled={emailSending} className="shrink-0">
              {emailSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Email me my report
                </>
              )}
            </Button>
          </form>
        )}
        {emailError && (
          <p className="mt-2 text-sm text-red-600">{emailError}</p>
        )}
        {!emailSent && (
          <p className="mt-2 text-xs text-muted-foreground">
            Includes score, category breakdown, top 5 recommendations + ROI estimate.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button size="lg" className="flex-1" asChild>
          <a href="https://cal.com/talkra" target="_blank" rel="noopener noreferrer">
            <Phone className="mr-2 h-4 w-4" />
            Book a Talkra Demo
          </a>
        </Button>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
