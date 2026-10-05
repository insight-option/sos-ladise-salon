# Soso Ladies Salon — سوسو – صالون نسائي

Bilingual (Arabic/English) website for a ladies salon in Qatar: services, salon and home-service booking requests, customer accounts and an admin dashboard.

**Status:** Phase 1 (foundation, design system, home, services, visual booking flow) runs on local **demo data**. Booking submission is a preview only and creates nothing. See `docs/`.

## Run locally

Requires Node.js 24.21+ (`.nvmrc`).

```bash
npm ci
cp .env.example .env.local   # APP_ENV=preview, DATA_SOURCE=demo
npm run dev                  # http://localhost:3000 → /ar
```

## Checks

```bash
npm run check   # route typegen + tsc + eslint + prettier + vitest
npm run build   # fails for production if demo data or required env is configured
```

## Structure

- `src/app/[locale]/…`: pages (`/ar`, `/en`)
- `src/components/`: UI, with no hard-coded copy or business data
- `src/lib/data/`: domain types and the data repository (demo now, Amplify in Phase 2)
- `src/lib/booking/`: booking draft persistence and preview-only slot listing
- `messages/`: Arabic and English copy
- `amplify/`: Amplify Gen 2 backend (still the starter schema; replaced in Phase 2, **do not deploy**)
- `docs/`: decisions, assumptions, open questions, design system, image checklist

No deployment happens without explicit approval.
