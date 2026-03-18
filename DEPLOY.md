# Deploy Guide — Voice AI Scorecard

**Stack:** Next.js (Vercel) + PostgreSQL (Railway or Supabase)  
**Estimated time:** 30-60 min  
**Cost:** ~$5-15/month (Railway starter + Vercel free)

---

## Step 1 — Database (Railway PostgreSQL)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway new glicobr-scorecard-db

# Add PostgreSQL plugin
railway add --plugin postgresql

# Get connection string
railway variables | grep DATABASE_URL
```

Copy the `DATABASE_URL` — you'll need it for Vercel.

**Alternative: Supabase (free tier)**
1. Create project at supabase.com
2. Settings → Database → Connection string → URI
3. Use that as `DATABASE_URL`

---

## Step 2 — Run DB Migrations

```bash
cd /Users/hzis/voice-ai-scorecard

# Set DATABASE_URL temporarily
export DATABASE_URL="postgresql://..."

# Push schema
npx prisma db push

# Verify
npx prisma studio
```

---

## Step 3 — Vercel Deploy

```bash
# Login to Vercel
vercel login

# Deploy from repo root
cd /Users/hzis/voice-ai-scorecard
vercel --prod

# Or connect via Vercel dashboard:
# vercel.com → New Project → Import from GitHub → hzis/voice-ai-scorecard
```

**Set these env vars in Vercel dashboard** (Project → Settings → Environment Variables):

```
NEXT_PUBLIC_APP_URL=https://scorecard.talkra.ai

# Clerk (get from clerk.com dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# Stripe (get from stripe.com dashboard)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_SCORECARD=price_...   ← the $19 price ID

# Database (from Railway or Supabase)
DATABASE_URL=postgresql://...

# Analytics (optional for MVP)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## Step 4 — Custom Domain

In Vercel dashboard:
1. Project → Settings → Domains
2. Add: `scorecard.talkra.ai`
3. Add DNS record at your domain provider:
   ```
   Type: CNAME
   Name: scorecard
   Value: cname.vercel-dns.com
   ```

---

## Step 5 — Stripe Webhook

In Stripe dashboard → Webhooks → Add endpoint:
```
URL: https://scorecard.talkra.ai/api/webhooks/stripe
Events: checkout.session.completed
```

Copy webhook secret → set as `STRIPE_WEBHOOK_SECRET` in Vercel.

---

## Step 6 — Clerk Webhook

In Clerk dashboard → Webhooks → Add endpoint:
```
URL: https://scorecard.talkra.ai/api/webhooks/clerk
Events: user.created, user.updated
```

Copy signing secret → set as `CLERK_WEBHOOK_SECRET` in Vercel.

---

## Step 7 — Smoke Test

```bash
# Test landing
curl -I https://scorecard.talkra.ai

# Test API
curl https://scorecard.talkra.ai/api/scorecard/checkout \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"answers":{"q1":0,"q2":1,"q3":2,"q4":0,"q5":1,"q6":2,"q7":0,"q8":1,"q9":2,"q10":0,"q11":1,"q12":2,"q13":0,"q14":1,"q15":2}}'
```

---

## Checklist

- [ ] DATABASE_URL set and migrations run
- [ ] Clerk keys configured (publishable + secret)
- [ ] Stripe keys configured (secret + price ID `STRIPE_PRICE_SCORECARD`)
- [ ] Vercel deploy successful (build passed ✅)
- [ ] Domain `scorecard.talkra.ai` pointing to Vercel
- [ ] Stripe webhook configured
- [ ] Clerk webhook configured
- [ ] End-to-end test: fill form → pay → see results
- [ ] Mobile test on Zenfone 9

---

## Current Status (as of 2026-03-18)

- ✅ Code on GitHub: `hzis/voice-ai-scorecard` (main branch)
- ✅ Build passing (`npm run build` — 0 errors)
- ✅ Mobile audit done (#294)
- ✅ Viewport meta, touch targets, break-words fixed
- ⏳ Needs: Vercel login + deploy
- ⏳ Needs: DATABASE_URL (Railway or Supabase)
- ⏳ Needs: Clerk + Stripe keys in Vercel env vars
