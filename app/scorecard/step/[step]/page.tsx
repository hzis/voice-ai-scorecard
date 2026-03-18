"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getQuestionsForStep, stepLabels } from "@/lib/questions";

const STORAGE_KEY = "scorecard-answers";

function getStoredAnswers(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function setStoredAnswers(answers: Record<string, number>) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

export default function StepPage() {
  const router = useRouter();
  const params = useParams();
  const stepNum = Number(params.step);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAnswers(getStoredAnswers());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isNaN(stepNum) || stepNum < 1 || stepNum > 4) {
    router.replace("/scorecard/step/1");
    return null;
  }

  const stepQuestions = getQuestionsForStep(stepNum);
  const label = stepLabels[stepNum];
  const allAnswered = stepQuestions.every((q) => answers[q.id] !== undefined);

  function selectOption(questionId: string, optionIndex: number) {
    const next = { ...answers, [questionId]: optionIndex };
    setAnswers(next);
    setStoredAnswers(next);
  }

  function handleNext() {
    if (!allAnswered) return;
    if (stepNum < 4) {
      router.push(`/scorecard/step/${stepNum + 1}`);
    } else {
      router.push("/scorecard/paywall");
    }
  }

  function handleBack() {
    if (stepNum > 1) {
      router.push(`/scorecard/step/${stepNum - 1}`);
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Step {stepNum} of 4 &mdash; {label}
          </span>
          <span>{Math.round((stepNum / 4) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(stepNum / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {stepQuestions.map((q, qi) => (
          <div key={q.id}>
            <h2 className="mb-4 text-lg font-semibold">
              {q.id.replace("q", "")}.{" "}
              {q.text}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {q.options.map((option, oi) => (
                <button
                  key={oi}
                  type="button"
                  onClick={() => selectOption(q.id, oi)}
                  className={`rounded-lg border-2 p-4 text-left text-sm transition-colors min-h-[44px] ${
                    answers[q.id] === oi
                      ? "border-primary bg-primary/5 font-medium"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={stepNum === 1}
        >
          Back
        </Button>
        <Button onClick={handleNext} disabled={!allAnswered}>
          {stepNum === 4 ? "See My Score" : "Next"}
        </Button>
      </div>
    </div>
  );
}
