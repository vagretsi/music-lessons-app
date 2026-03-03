# Maestro — Music Lessons Platform

A full-stack online music academy built with Next.js 14. Students can watch video lessons, book live 1-on-1 sessions with teachers, track their practice, and get AI-powered feedback on their playing.

## Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Prisma |
| Auth | NextAuth.js v4 (credentials + Google OAuth) |
| Payments | Stripe (subscriptions) |
| AI | Google Gemini 2.5 Flash |
| Styling | Tailwind CSS |
| i18n | English + Greek (Ελληνικά) |

## Features

- **Video Lessons** — On-demand lessons organised by instrument and level
- **Live 1-on-1 Booking** — Schedule personal sessions with teachers based on their availability
- **Progress Tracking** — Log practice sessions with duration, mood, and notes
- **AI Feedback** — Describe your playing and receive personalised, actionable feedback from Gemini
- **Subscription Plans** — Three tiers managed entirely via Stripe
- **Admin Panel** — Manage users, teachers, lessons, and subscriptions
- **Bilingual** — English and Greek UI with per-user language preference

## Subscription Tiers

| Tier | Price | Highlights |
|---|---|---|
| **Prelude** | Free | 5 video lessons/month, basic progress tracking |
| **Sonata** | €14.99/mo | Unlimited lessons, 2 live sessions/month, 5 AI feedbacks/month |
| **Symphony** | €29.99/mo | Everything in Sonata + unlimited live sessions & AI feedback, masterclasses |

Yearly billing available at a 20% discount.

---

## Local Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd music-lessons-app
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local` (see [Environment Variables](#environment-variables) below).

### 3. Set up Stripe products

In your [Stripe Dashboard](https://dashboard.stripe.com/products), create two products:

**Sonata**
- Monthly: €14.99 → `STRIPE_PRICE_SONATA_MONTHLY`
- Yearly: €143.90 → `STRIPE_PRICE_SONATA_YEARLY`

**Symphony**
- Monthly: €29.99 → `STRIPE_PRICE_SYMPHONY_MONTHLY`
- Yearly: €287.90 → `STRIPE_PRICE_SYMPHONY_YEARLY`

### 4. Set up the database

```bash
npm run db:migrate    # apply migrations
npm run db:generate   # generate Prisma client
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Stripe webhook (local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the printed signing secret to `STRIPE_WEBHOOK_SECRET`.

---

## Deploying to a Server

```bash
# On the server
git pull origin main
npm install
npm run db:migrate
npm run build
npm start
```

### With PM2

```bash
npm install -g pm2
npm run build
pm2 start npm --name "maestro" -- start
pm2 save && pm2 startup
```

### Nginx reverse proxy

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

### Stripe webhook (production)

In Stripe Dashboard → Webhooks → Add endpoint:
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/             # Login & register pages
│   ├── (dashboard)/        # Protected student pages
│   │   ├── dashboard/
│   │   ├── lessons/
│   │   ├── booking/
│   │   ├── progress/
│   │   └── ai-feedback/
│   ├── (admin)/            # Admin panel
│   ├── api/
│   │   ├── auth/           # NextAuth + register
│   │   ├── stripe/         # Checkout + webhook
│   │   ├── booking/
│   │   ├── progress/
│   │   ├── ai-feedback/    # Gemini integration
│   │   └── admin/          # User, teacher, lesson management
│   ├── pricing/
│   └── page.tsx            # Landing page
├── components/
│   ├── admin/
│   ├── booking/
│   ├── layout/             # Navbar, Footer
│   └── progress/
├── i18n/                   # en.ts + el.ts translations
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── prisma.ts           # DB client singleton
│   ├── stripe.ts           # Stripe client + plan definitions
│   └── utils.ts
└── middleware.ts            # Route protection (JWT-based)
prisma/
└── schema.prisma           # Full DB schema
```

---

## User Roles

| Role | Access |
|---|---|
| **STUDENT** | Lessons, booking, progress, AI feedback |
| **TEACHER** | Has a teacher profile with bio, instruments, and availability |
| **ADMIN** | Full admin panel — users, teachers, lessons, subscriptions |

---

## Adding Teachers

Use Prisma Studio to add teachers directly:

```bash
npm run db:studio
```

1. Create a `User` with `role: TEACHER`
2. Create a `TeacherProfile` linked to that user (bio, instruments, experience)
3. Add `Availability` records for their weekly schedule
4. Publish `Lesson` records linked to the teacher

Alternatively, promote a user to `ADMIN` and use the admin panel at `/admin`.

---

## Database Scripts

```bash
npm run db:migrate    # Create and apply a new migration
npm run db:generate   # Regenerate the Prisma client
npm run db:push       # Push schema without a migration (dev only)
npm run db:studio     # Open Prisma Studio in the browser
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | App base URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same key, exposed to the client |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_SONATA_MONTHLY` | Stripe price ID |
| `STRIPE_PRICE_SONATA_YEARLY` | Stripe price ID |
| `STRIPE_PRICE_SYMPHONY_MONTHLY` | Stripe price ID |
| `STRIPE_PRICE_SYMPHONY_YEARLY` | Stripe price ID |
| `GEMINI_API_KEY` | Google Gemini API key (for AI feedback) |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `GOOGLE_CLIENT_ID` | (Optional) Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | (Optional) Google OAuth client secret |
