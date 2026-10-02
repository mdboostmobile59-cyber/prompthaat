# PromptHaat — AI Prompt Marketplace

Bangladesh-first AI Prompt Marketplace (Next.js 15, Prisma/Postgres, Tailwind).

## Features
- Dark + Light theme (toggle in header, preference saved)
- Header v2 + Hero with search and FREE/PREMIUM showcase
- DB-driven prompts/categories — no hard-coded prices/content. Admin Panel controls everything.
- Free prompts: View Prompt -> Details -> Login to Unlock
- Premium prompts: price shown before purchase -> Checkout (simulated payment adapter) -> Unlock -> Copy
- VIP: ৳999 all-access (price/enable controlled from Admin > VIP / Settings). VIP unlocks all Premium prompts.
- Admin: Dashboard, Prompts (Add/Edit/Delete/Duplicate, price, featured, publish/draft), Categories, Users, Orders, Payments, Homepage (featured), WhatsApp & Website/VIP Settings
- Favorites, Dashboard/My Purchases, Search/Filter/Sort

## Env
See `.env.example`. Required: `DATABASE_URL`, `JWT_SECRET`.

## Build
`npm run build` runs `prisma generate && next build`. Do NOT use `prisma db push` in the Vercel build command.
Database schema changes (e.g. new VipSubscription model) must be applied with a Prisma migration / `prisma db push` manually against your Postgres before deploying this version.

## Payment
`src/app/api/payment/checkout` is a simulated adapter for development, clearly separated. Replace its verification step with a real bKash/Nagad/Card gateway for production.
