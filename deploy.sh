#!/bin/bash
# Scorecard Deploy Script — run after setting env vars
# Usage: source .env.production && bash deploy.sh
set -e

echo "=== Scorecard Deploy Script ==="
echo ""

# Validate required vars
REQUIRED="DATABASE_URL STRIPE_SECRET_KEY STRIPE_PRICE_SCORECARD NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY NEXT_PUBLIC_APP_URL"
for VAR in $REQUIRED; do
  if [ -z "${!VAR}" ]; then
    echo "❌ Missing: $VAR"
    exit 1
  fi
  echo "✅ $VAR set"
done
echo ""

# Step 1: DB migration
echo "=== Step 1: Database migration ==="
npx prisma db push --accept-data-loss
echo "✅ Schema pushed"
echo ""

# Step 2: Vercel deploy
echo "=== Step 2: Vercel deploy ==="
vercel --prod --yes

# Step 3: Set env vars
echo "=== Step 3: Setting env vars ==="
echo "$DATABASE_URL" | vercel env add DATABASE_URL production --yes 2>/dev/null || true
echo "$STRIPE_SECRET_KEY" | vercel env add STRIPE_SECRET_KEY production --yes 2>/dev/null || true
echo "$STRIPE_PRICE_SCORECARD" | vercel env add STRIPE_PRICE_SCORECARD production --yes 2>/dev/null || true
echo "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production --yes 2>/dev/null || true
echo "https://scorecard.talkra.ai" | vercel env add NEXT_PUBLIC_APP_URL production --yes 2>/dev/null || true
if [ -n "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" ]; then
  echo "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production --yes 2>/dev/null || true
  echo "$CLERK_SECRET_KEY" | vercel env add CLERK_SECRET_KEY production --yes 2>/dev/null || true
fi
echo "✅ Env vars set"
echo ""

# Step 4: Redeploy with env vars
echo "=== Step 4: Redeploy with env vars ==="
vercel --prod --yes

echo ""
echo "=== ✅ DEPLOY COMPLETE ==="
echo "URL: https://scorecard.talkra.ai"
echo ""
echo "Next steps:"
echo "1. Add domain in Vercel: vercel domains add scorecard.talkra.ai"
echo "2. Add Cloudflare CNAME: scorecard → cname.vercel-dns.com"
echo "3. Configure Stripe webhook: https://scorecard.talkra.ai/api/webhooks/stripe"
echo "4. Test: curl https://scorecard.talkra.ai/"
