import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal middleware for MVP - no auth required for scorecard flow
// Clerk auth is optional (only used for /dashboard and /billing)
export default function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
