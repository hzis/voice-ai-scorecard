# Setup Checklist for New App

Follow these steps to launch a new micro-app using this shell.

## Initial Setup

- [ ] Clone repo: `git clone https://github.com/hzis/micro-app-shell.git my-app`
- [ ] Install dependencies: `cd my-app && npm install`
- [ ] Copy env file: `cp .env.example .env.local`

## Services Configuration

### Clerk (Auth)
- [ ] Create a new Clerk project at [clerk.com](https://clerk.com)
- [ ] Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env.local`
- [ ] Copy `CLERK_SECRET_KEY` to `.env.local`
- [ ] Set up Clerk webhook (Events: `user.created`) pointing to `https://your-domain.com/api/webhooks/clerk`
- [ ] Copy webhook signing secret to `CLERK_WEBHOOK_SECRET`

### Stripe (Payments)
- [ ] Create products and prices in Stripe Dashboard
- [ ] Copy `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Copy price IDs to `STRIPE_PRICE_PRO_MONTHLY` and `STRIPE_PRICE_PRO_ANNUAL`
- [ ] Set up Stripe webhook (Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`) pointing to `https://your-domain.com/api/webhooks/stripe`
- [ ] Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Supabase (Database)
- [ ] Create a new Supabase project at [supabase.com](https://supabase.com)
- [ ] Copy the connection string to `DATABASE_URL`
- [ ] Run migrations: `npx prisma migrate dev --name init`

### Resend (Email)
- [ ] Create an API key at [resend.com](https://resend.com)
- [ ] Copy to `RESEND_API_KEY`
- [ ] Configure your sending domain

### PostHog (Analytics)
- [ ] Create a project at [posthog.com](https://posthog.com)
- [ ] Copy project API key to `NEXT_PUBLIC_POSTHOG_KEY`

### OpenAI (AI - optional)
- [ ] Get API key from [platform.openai.com](https://platform.openai.com)
- [ ] Copy to `OPENAI_API_KEY`

## Customization

- [ ] Edit `config/site.ts` — name, description, plans, features, testimonials, FAQ
- [ ] Update colors in `app/globals.css` (CSS variables)
- [ ] Replace `public/og.png` with your Open Graph image
- [ ] Update email templates in `emails/`

## Deploy

- [ ] Deploy to Vercel: `vercel` or via dashboard
- [ ] Add all environment variables in Vercel dashboard
- [ ] Configure production webhook URLs (Stripe + Clerk)
- [ ] Test the full flow: sign-up → dashboard → billing → upgrade
