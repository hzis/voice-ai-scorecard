import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 pb-16 pt-24 text-center md:pb-24 md:pt-32">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Build & Ship Your{" "}
          <span className="text-primary">Micro-App</span> in Days
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
      </div>

      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/sign-up">Start Free</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="#features">See Demo</Link>
        </Button>
      </div>

      <div className="mx-auto mt-8 w-full max-w-4xl rounded-xl border bg-muted/50 p-4">
        <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">
            App screenshot / demo placeholder
          </p>
        </div>
      </div>
    </section>
  );
}
