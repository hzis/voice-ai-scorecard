# Micro-App Shell

A reusable web shell for launching micro-apps in 1-3 days, reusing 90% of the code base.

## Architecture

```
Next.js 14 (App Router) + TypeScript
├── Auth:       Clerk.dev
├── Payments:   Stripe (swappable to LemonSqueezy)
├── Database:   Prisma + PostgreSQL (Supabase)
├── Email:      Resend + React Email
├── Analytics:  PostHog
├── AI:         OpenAI-compatible streaming endpoint
├── Styling:    Tailwind CSS + shadcn/ui
└── Deploy:     Vercel
```

## Prerequisites

- Node.js 20+
- Accounts: [Clerk](https://clerk.com), [Stripe](https://stripe.com), [Resend](https://resend.com), [PostHog](https://posthog.com), [Supabase](https://supabase.com)

## Getting Started

```bash
# 1. Clone
git clone https://github.com/hzis/micro-app-shell.git
cd micro-app-shell

# 2. Install
npm install

# 3. Set up environment
cp .env.example .env.local
# Fill in all values in .env.local

# 4. Set up database
npx prisma migrate dev --name init

# 5. Run
npm run dev
```

## Customizing for a New App

Edit **`config/site.ts`** — this single file controls:

| Field          | What it controls                        |
| -------------- | --------------------------------------- |
| `name`         | App name (header, footer, emails)       |
| `description`  | Meta description and landing hero       |
| `plans`        | Pricing tiers, Stripe price IDs, limits |
| `features`     | Landing page feature grid               |
| `testimonials` | Social proof section                    |
| `faq`          | FAQ accordion                           |
| `nav`          | Marketing page navigation               |
| `appNav`       | Dashboard sidebar navigation            |
| `limits`       | Free/Pro usage limits                   |

Then update colors in `app/globals.css` and the OG image in `public/og.png`.

## Project Structure

```
app/
  (marketing)/page.tsx    # Landing page
  (auth)/                 # Sign-in / Sign-up (Clerk)
  (app)/                  # Dashboard + Billing (auth-guarded)
  api/                    # Webhooks (Stripe, Clerk) + AI stream
components/               # Landing, Dashboard, Billing, AI components
lib/                      # Stripe, Prisma, PostHog, Resend, AI clients
hooks/                    # useSubscription, useStream
config/site.ts            # Central config — edit this first
emails/                   # React Email templates
prisma/schema.prisma      # Database schema
backend/                  # Optional FastAPI for AI heavy lifting
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hzis/micro-app-shell)

1. Click the button above or run `vercel`
2. Add all environment variables from `.env.example`
3. Configure Stripe webhook URL: `https://your-domain.com/api/webhooks/stripe`
4. Configure Clerk webhook URL: `https://your-domain.com/api/webhooks/clerk`

## Adding a New Feature

1. Create your page in `app/(app)/your-feature/page.tsx`
2. Add components in `components/your-feature/`
3. Update `appNav` in `config/site.ts`
4. Add any new API routes in `app/api/`

## License

MIT
