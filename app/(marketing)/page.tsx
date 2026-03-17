import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/config/site";
import {
  ClipboardList,
  BarChart3,
  FileText,
  Phone,
  CheckCircle2,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ClipboardList,
  BarChart3,
  FileText,
  Phone,
};

const steps = [
  {
    num: "1",
    title: "Answer 15 Questions",
    desc: "Quick multiple-choice questions about your call volume, tech stack, processes, and ROI potential.",
  },
  {
    num: "2",
    title: "Get Your Score",
    desc: "Instant 0-100 readiness score across 4 dimensions with detailed category breakdown.",
  },
  {
    num: "3",
    title: "Act on Recommendations",
    desc: "Receive 5 tailored recommendations, ROI estimate, and a PDF implementation roadmap.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold">
            {siteConfig.name}
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button asChild size="sm">
            <Link href="/scorecard">Take the Scorecard</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center gap-6 pb-16 pt-24 text-center md:pb-24 md:pt-32">
          <div className="mx-auto max-w-3xl space-y-4 px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Is Your Business Ready for an{" "}
              <span className="text-primary">AI Voice Agent</span>?
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-2 text-sm font-medium text-muted-foreground">
              $19 one-time &middot; No subscription
            </div>
          </div>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/scorecard">Take the Scorecard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#how-it-works">How It Works</Link>
            </Button>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-t bg-muted/30 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-2 text-muted-foreground">
                Three steps to your Voice AI readiness report.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {steps.map((s) => (
                <div key={s.num} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {s.num}
                  </div>
                  <h3 className="mb-2 font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What You Get
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {siteConfig.features.map((feature) => {
                const Icon = iconMap[feature.icon];
                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                    </div>
                    <h3 className="mb-2 font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="border-t bg-muted/30 py-16 md:py-24">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
              All for $19
            </h2>
            <div className="space-y-3 text-left">
              {[
                "Full score breakdown across 4 readiness dimensions",
                "Category-by-category analysis",
                "Top 5 personalized recommendations",
                "ROI estimate based on your call volume and deal size",
                "Downloadable PDF report with 90-day roadmap",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/scorecard">Start Now</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {siteConfig.faq.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
          <div>
            <p className="font-semibold">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
          <div className="flex items-center gap-6">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl px-4">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Talkra AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
