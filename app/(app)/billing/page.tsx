"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortalButton } from "@/components/billing/portal-button";
import { UsageMeter } from "@/components/dashboard/usage-meter";
import { useSubscription } from "@/hooks/use-subscription";

export default function BillingPage() {
  const { plan, usageCount, usageLimit, isLoading } = useSubscription();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-2xl font-bold capitalize">
              {isLoading ? "..." : plan}
            </p>
            <UsageMeter current={usageCount} limit={usageLimit} />
            <PortalButton />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need More?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upgrade your plan to get more requests, priority support, and
              access to all features. Visit the pricing page or manage your
              subscription via the Stripe portal.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
