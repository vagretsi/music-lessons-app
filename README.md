# 🎵 Maestro — Music Lessons Platform

A full-stack music lessons platform built with Next.js 14, TypeScript, PostgreSQL, Stripe, and NextAuth.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma
- **Auth**: NextAuth.js (credentials + optional Google)
- **Payments**: Stripe (subscriptions)
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o-mini (AI feedback feature)
- **i18n**: Greek 🇬🇷 + English 🇬🇧

## Subscription Tiers

| Tier | Price | Features |
|------|-------|---------|
| **Prelude** | Free | 5 lessons/mo, basic progress |
| **Sonata** | €14.99/mo | Unlimited lessons, 2 live sessions, 5 AI feedbacks |
| **Symphony** | €29.99/mo | Everything + unlimited live sessions + unlimited AI |

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:
- `DATABASE_URL` — your Docker Postgres connection string
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32`
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` — from Stripe dashboard
- `STRIPE_WEBHOOK_SECRET` — from Stripe CLI / webhook endpoint
- `OPENAI_API_KEY` — from OpenAI
- Stripe Price IDs (see below)

### 3. Set up Stripe Price IDs

In your [Stripe Dashboard](https://dashboard.stripe.com/products):

1. Create a product **"Sonata"** with two prices:
   - Monthly: €14.99 → copy price ID → `STRIPE_PRICE_SONATA_MONTHLY`
   - Yearly: €143.90 → copy price ID → `STRIPE_PRICE_SONATA_YEARLY`

2. Create a product **"Symphony"** with two prices:
   - Monthly: €29.99 → copy price ID → `STRIPE_PRICE_SYMPHONY_MONTHLY`
   - Yearly: €287.90 → copy price ID → `STRIPE_PRICE_SYMPHONY_YEARLY`

### 4. Set up the database

Make sure your PostgreSQL Docker container is running, then:

```bash
npm run db:push       # Push schema to DB
npm run db:generate   # Generate Prisma client
```

Or for production-style migrations:
```bash
npm run db:migrate
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Set up Stripe webhook (for local dev)

Install Stripe CLI, then:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in your `.env`.

---

## Deploying to Your Server

### On your local machine:

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin <your-git-repo-url>
git push -u origin main
```

### On your server:

```bash
git pull origin main
npm install
npm run db:migrate    # Run any new migrations
npm run build
npm start             # or use PM2
```

### With PM2 (recommended):

```bash
npm install -g pm2
npm run build
pm2 start npm --name "maestro" -- start
pm2 save
pm2 startup
```

### Nginx reverse proxy config:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Stripe webhook on production:

In Stripe Dashboard → Webhooks → Add endpoint:
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/           # NextAuth + register
│   │   ├── stripe/         # Checkout + webhook
│   │   ├── booking/        # Booking CRUD
│   │   ├── progress/       # Practice log
│   │   └── ai-feedback/    # OpenAI integration
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── lessons/
│   │   ├── booking/
│   │   ├── progress/
│   │   └── ai-feedback/
│   ├── pricing/
│   └── page.tsx            # Landing page
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── booking/            # BookingForm
│   └── progress/           # PracticeLogForm
├── i18n/                   # EN + EL translations
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── prisma.ts           # DB client
│   ├── stripe.ts           # Stripe + plans
│   └── utils.ts
└── middleware.ts            # Route protection
prisma/
└── schema.prisma           # Full DB schema
```

---

## Adding Teachers

Currently teachers are added directly to the DB. Use Prisma Studio:

```bash
npm run db:studio
```

1. Create a `User` with `role: TEACHER`
2. Create a `TeacherProfile` linked to that user
3. Add `Availability` records for their schedule
4. Publish `Lesson` records linked to the teacher

---

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | App URL (e.g. http://localhost:3000) |
| `NEXTAUTH_SECRET` | Random secret for JWT |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_SONATA_MONTHLY` | Stripe price ID |
| `STRIPE_PRICE_SONATA_YEARLY` | Stripe price ID |
| `STRIPE_PRICE_SYMPHONY_MONTHLY` | Stripe price ID |
| `STRIPE_PRICE_SYMPHONY_YEARLY` | Stripe price ID |
| `OPENAI_API_KEY` | OpenAI API key (for AI feedback) |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
