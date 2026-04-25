/**
 * AI Code Review panel component for CodeX.
 * Features:
 * - Gemini AI powered code review
 * - Structured feedback with categories
 * - Code quality score
 */

"use client";

import {
  AlertTriangle,
  Bug,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Loader2,
  Shield,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReviewItem {
  description: string;
  example?: string | null;
  fix?: string;
  line?: number | null;
  passed?: boolean;
  severity?: "high" | "medium" | "low";
}

interface ReviewResult {
  bestPractices: ReviewItem[];
  bugs: ReviewItem[];
  improvements: ReviewItem[];
  score: number;
  security: ReviewItem[];
  summary: string;
}

interface CodeReviewProps {
  code?: string | null;
  language?: string;
}

const severityColor = (severity?: string) => {
  switch (severity) {
    case "high":
      return "text-red-400";
    case "medium":
      return "text-yellow-400";
    case "low":
      return "text-blue-400";
    default:
      return "text-muted-foreground";
  }
};

const scoreColor = (score: number) => {
  if (score >= 80) {
    return "text-green-400";
  }
  if (score >= 60) {
    return "text-yellow-400";
  }
  return "text-red-400";
};

function Section({
  title,
  icon,
  items,
  renderItem,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  items: ReviewItem[];
  renderItem: (item: ReviewItem, i: number) => React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (!items?.length) {
    return null;
  }
  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <button
        className="flex w-full items-center justify-between bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-2 font-semibold text-xs">
          {icon}
          {title}
          <span className="font-normal text-muted-foreground">
            ({items.length})
          </span>
        </div>
        {open ? (
          <ChevronUp className="size-3 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-3 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="divide-y divide-white/5">
          {items.map((item, i) => renderItem(item, i))}
        </div>
      )}
    </div>
  );
}

export function CodeReview({ code, language }: CodeReviewProps) {
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runReview = async () => {
    if (!code?.trim()) {
      setError("No code to review. Write some code first!");
      return;
    }
    setIsLoading(true);
    setError(null);
    setReview(null);
    try {
      const response = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      if (!response.ok) {
        throw new Error("Failed to get review");
      }
      const data = await response.json();
      setReview(data);
    } catch {
      setError("Failed to review code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-white/10 border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-green-500/20">
            <Sparkles className="size-3 text-green-400" />
          </div>
          <span className="font-semibold text-xs">AI Code Review</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {language || "No language"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
        {/* Review Button */}
        <button
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-xs transition-colors",
            isLoading
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-green-500 text-white hover:bg-green-600"
          )}
          disabled={isLoading}
          onClick={runReview}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-3 animate-spin" />
              Reviewing your code...
            </>
          ) : (
            <>
              <Sparkles className="size-3" />
              {review ? "Review Again" : "Review My Code"}
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Results */}
        {review && (
          <div className="flex flex-col gap-3">
            {/* Score Card */}
            <div className="rounded-lg border border-white/10 bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    Code Quality Score
                  </p>
                  <p
                    className={cn(
                      "mt-1 font-bold text-3xl",
                      scoreColor(review.score)
                    )}
                  >
                    {review.score}
                    <span className="font-normal text-muted-foreground text-sm">
                      /100
                    </span>
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full border-2 border-white/10">
                  {review.score >= 80 ? (
                    <CheckCircle className="size-6 text-green-400" />
                  ) : review.score >= 60 ? (
                    <AlertTriangle className="size-6 text-yellow-400" />
                  ) : (
                    <XCircle className="size-6 text-red-400" />
                  )}
                </div>
              </div>
              <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
                {review.summary}
              </p>
            </div>

            {/* Bugs */}
            <Section
              icon={<Bug className="size-3 text-red-400" />}
              items={review.bugs}
              renderItem={(item, i) => (
                <div className="px-3 py-2 text-xs" key={i}>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-semibold text-[10px] uppercase",
                        severityColor(item.severity)
                      )}
                    >
                      {item.severity}
                    </span>
                    {item.line && (
                      <span className="text-muted-foreground">
                        Line {item.line}
                      </span>
                    )}
                  </div>
                  <p className="mt-1">{item.description}</p>
                  {item.fix && (
                    <p className="mt-1 text-green-400">Fix: {item.fix}</p>
                  )}
                </div>
              )}
              title="Bugs"
            />

            {/* Improvements */}
            <Section
              icon={<Lightbulb className="size-3 text-yellow-400" />}
              items={review.improvements}
              renderItem={(item, i) => (
                <div className="px-3 py-2 text-xs" key={i}>
                  <p>{item.description}</p>
                  {item.example && (
                    <pre className="mt-1 overflow-x-auto rounded bg-black/30 p-2 text-green-400">
                      {item.example}
                    </pre>
                  )}
                </div>
              )}
              title="Improvements"
            />

            {/* Best Practices */}
            <Section
              icon={<CheckCircle className="size-3 text-blue-400" />}
              items={review.bestPractices}
              renderItem={(item, i) => (
                <div
                  className="flex items-start gap-2 px-3 py-2 text-xs"
                  key={i}
                >
                  {item.passed ? (
                    <CheckCircle className="mt-0.5 size-3 shrink-0 text-green-400" />
                  ) : (
                    <XCircle className="mt-0.5 size-3 shrink-0 text-red-400" />
                  )}
                  <p>{item.description}</p>
                </div>
              )}
              title="Best Practices"
            />

            {/* Security */}
            <Section
              icon={<Shield className="size-3 text-purple-400" />}
              items={review.security}
              renderItem={(item, i) => (
                <div className="px-3 py-2 text-xs" key={i}>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-semibold text-[10px] uppercase",
                        severityColor(item.severity)
                      )}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <p className="mt-1">{item.description}</p>
                  {item.fix && (
                    <p className="mt-1 text-green-400">Fix: {item.fix}</p>
                  )}
                </div>
              )}
              title="Security"
            />
          </div>
        )}
      </div>
    </div>
  );
}
