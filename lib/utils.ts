import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function absoluteUrl(path: string) {
  // Use NEXT_PUBLIC_APP_URL (available both client and server in Next.js)
  // Fallback to hardcoded production URL if env var is missing
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://scorecard.talkra.ai";
  return `${base}${path}`;
}
