"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const LIMITS = { free: 10, pro: 1000 };

interface SubscriptionState {
  isPro: boolean;
  plan: string;
  usageCount: number;
  usageLimit: number;
  isLoading: boolean;
}

export function useSubscription(): SubscriptionState {
  const { user } = useUser();
  const [state, setState] = useState<SubscriptionState>({
    isPro: false,
    plan: "free",
    usageCount: 0,
    usageLimit: LIMITS.free,
    isLoading: true,
  });

  useEffect(() => {
    if (!user) return;

    async function fetchSubscription() {
      try {
        const res = await fetch("/api/user/subscription");
        if (res.ok) {
          const data = await res.json();
          setState({
            isPro: data.plan === "pro",
            plan: data.plan,
            usageCount: data.usageCount,
            usageLimit: data.plan === "pro" ? LIMITS.pro : LIMITS.free,
            isLoading: false,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }

    fetchSubscription();
  }, [user]);

  return state;
}
