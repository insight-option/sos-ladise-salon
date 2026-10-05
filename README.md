# Soso Ladies Salon — سوسو – صالون نسائي

Bilingual (Arabic/English) showcase site for a ladies salon in Qatar: services, images, the hero video and contact. Booking and enquiries go through WhatsApp. There are no accounts, no online booking, no database and no backend.

- Call: +974 3342 8070
- WhatsApp: +974 7474 8944

## Run locally

Requires Node.js 24.21+ (`.nvmrc`).

```bash
npm ci
npm run dev        # http://localhost:3000 → /ar
```

## Checks

```bash
npm run check      # route typegen + tsc + eslint + prettier + vitest
npm run build
```

## Deploy (AWS Amplify Hosting, via the Console)

`amplify.yml` is frontend-only. Create a **separate** Amplify app for Soso, connect this GitHub repository and choose the branch. Amplify reads `amplify.yml`. No backend resources are created.

| Variable | Default | Purpose |
|---|---|---|
| `APP_ENV` | `preview` | `preview` = not indexed by search engines; `production` = indexable |
| `NEXT_PUBLIC_SITE_URL` | derived on Amplify | Set it once a custom domain is connected |

## Structure

- `src/app/[locale]/`: home, `services`, `home-service`, `contact` (`/ar`, `/en`)
- `src/components/`: UI; copy lives in `messages/`
- `src/lib/data/`: approved content (categories, images, contact numbers)
- `public/images/soso/`, `public/media/`: logo, illustrative images, hero video
- `docs/`: decisions, assumptions, open questions, design system, image checklist
