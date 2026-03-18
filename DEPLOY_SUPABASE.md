# Deploy Guide — Supabase + Vercel (Scorecard MVP)

**Atualizado:** 2026-03-18 — estratégia mudou de Railway para Supabase
**ETA após Henrique passar credenciais:** 15-20 min

---

## O que o scorecard precisa (mínimo)

| Variável | Onde pegar |
|----------|-----------|
| `DATABASE_URL` | Supabase → Settings → Database → URI |
| `STRIPE_SECRET_KEY` | stripe.com → API keys |
| `STRIPE_PRICE_SCORECARD` | Stripe → Products → seu produto $19 → price ID |
| `NEXT_PUBLIC_APP_URL` | `https://scorecard.talkra.ai` |

Clerk é **opcional para o scorecard** — só protege `/dashboard` e `/billing`.
Se quiser simplificar, pode comentar o `ClerkProvider` no layout por agora.

---

## Passo 1 — Supabase: DATABASE_URL

No dashboard Supabase (já logado):
1. Criar projeto: nome `scorecard`, senha forte, região `us-east-1`
2. Aguardar ~2 min para provisionar
3. Ir em: **Settings → Database → Connection string → URI**
4. Copiar a URI (formato: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`)
5. Substituir `[YOUR-PASSWORD]` pela senha escolhida

---

## Passo 2 — Rodar migrações (Prisma)

```bash
cd /Users/hzis/voice-ai-scorecard

# Setar DATABASE_URL temporariamente
export DATABASE_URL="postgresql://postgres:SENHA@db.REF.supabase.co:5432/postgres"

# Criar tabelas
npx prisma db push

# Verificar (opcional)
npx prisma studio
```

---

## Passo 3 — Vercel deploy

```bash
cd /Users/hzis/voice-ai-scorecard
vercel login          # abre browser → login com GitHub/email
vercel --prod
```

Quando perguntar sobre configuração:
- Framework: **Next.js** (auto-detect)
- Build command: `npm run build` (padrão)
- Output dir: `.next` (padrão)

---

## Passo 4 — Env vars no Vercel

Após deploy, ir em **Vercel dashboard → Project → Settings → Environment Variables** e adicionar:

```
DATABASE_URL=postgresql://postgres:SENHA@db.REF.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=https://scorecard.talkra.ai
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  (configurar após Passo 6)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_SCORECARD=price_...

# Clerk (opcional para MVP — scorecard flow não precisa)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...  
CLERK_SECRET_KEY=sk_live_...
```

Após adicionar vars: **Deployments → Redeploy** (para aplicar as vars)

---

## Passo 5 — Domínio

Vercel dashboard → Project → **Settings → Domains → Add → `scorecard.talkra.ai`**

No DNS (onde talkra.ai está registrado):
```
Type: CNAME
Name: scorecard
Value: cname.vercel-dns.com
```

---

## Passo 6 — Stripe webhook

Stripe dashboard → **Developers → Webhooks → Add endpoint**:
- URL: `https://scorecard.talkra.ai/api/webhooks/stripe`  
- Events: `checkout.session.completed`
- Copiar `Signing secret` → setar como `STRIPE_WEBHOOK_SECRET` no Vercel → Redeploy

---

## Passo 7 — Smoke test

```bash
# Página carrega
curl -I https://scorecard.talkra.ai

# API responde
curl -X POST https://scorecard.talkra.ai/api/scorecard/checkout \
  -H "Content-Type: application/json" \
  -d '{"answers":{"q1":2,"q2":2,"q3":2,"q4":2,"q5":2,"q6":2,"q7":2,"q8":2,"q9":2,"q10":2,"q11":2,"q12":2,"q13":2,"q14":2,"q15":2}}'
# Deve retornar {"url":"https://checkout.stripe.com/..."}
```

---

## Para Dev Sr executar assim que Henrique passar DATABASE_URL + STRIPE keys:

```bash
# Copiar DATABASE_URL
export DATABASE_URL="postgresql://..."

# Migrar DB
cd /Users/hzis/voice-ai-scorecard && npx prisma db push

# Deploy
vercel login && vercel --prod

# Setar vars (via CLI — mais rápido que dashboard)
vercel env add DATABASE_URL production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_PRICE_SCORECARD production
vercel env add NEXT_PUBLIC_APP_URL production   # valor: https://scorecard.talkra.ai
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production

# Redeploy com vars
vercel --prod
```
