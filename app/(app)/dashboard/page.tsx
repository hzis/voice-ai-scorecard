"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsageMeter } from "@/components/dashboard/usage-meter";
import { UpgradeBanner } from "@/components/dashboard/upgrade-banner";
import { useSubscription } from "@/hooks/use-subscription";
import { posthog } from "@/lib/posthog";
import { useEffect } from "react";

export default function DashboardPage() {
  const { isPro, plan, usageCount, usageLimit, isLoading } = useSubscription();
  const showUpgrade = !isPro && usageLimit > 0 && usageCount >= usageLimit * 0.8;

  useEffect(() => {
    posthog.capture("app_opened");
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your account.
        </p>
      </div>

      <UpgradeBanner show={showUpgrade} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">
              {isLoading ? "..." : plan}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usage This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UsageMeter current={usageCount} limit={usageLimit} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">Active</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            This is your app dashboard. Customize this page in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              app/(app)/dashboard/page.tsx
            </code>{" "}
            to display your app&apos;s main functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
