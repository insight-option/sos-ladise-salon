# Soso Ladies Salon — سوسو – صالون نسائي

Bilingual (Arabic/English) showcase site for a ladies salon in Qatar: services, images, the hero video and contact. Booking and enquiries go through WhatsApp. There are no accounts, no online booking, no database and no backend. The site is built as **plain static files**.

- Call: +974 3342 8070
- WhatsApp: +974 7474 8944

## Run locally

Requires Node.js 24.21+ (`.nvmrc`).

```bash
npm ci
npm run dev        # http://localhost:3000/ar/
npm run build      # static site in out/
npm start          # serves out/ like a static host, http://localhost:3000
```

## Checks

```bash
npm run check      # route typegen + tsc + eslint + prettier + vitest
```

## Deploy (AWS Amplify Hosting, via the Console)

`amplify.yml` builds the static site into `out/`. No backend resources are created.

1. Amplify → **Create new app** (a separate app for Soso) → GitHub → this repository and branch.
2. Keep the build settings from `amplify.yml`. No environment variables are needed.
3. If the build log shows `Can't find required-server-files.json`, Amplify classified the app as SSR. Open **AWS CloudShell** in the Console, run the command below, then redeploy:

   ```bash
   aws amplify update-app --app-id <APP_ID> --platform WEB --region ap-south-1
   ```

| Variable | Default | Purpose |
|---|---|---|
| `APP_ENV` | `preview` | `preview` = not indexed by search engines; `production` = indexable |
| `NEXT_PUBLIC_SITE_URL` | derived on Amplify | Set it once a custom domain is connected |

## Structure

- `src/app/[locale]/`: home, `services`, `home-service`, `contact` (`/ar/`, `/en/`)
- `src/components/`: UI; copy lives in `messages/`
- `src/lib/data/`: approved content (categories, images, contact numbers)
- `public/images/soso/`, `public/media/`: logo, illustrative images, hero video
- `assets/brand/`: original logo file (not served)
- `scripts/`: env check, prefetch fix for the static export, local static server
- `docs/`: decisions, assumptions, open questions, design system, image checklist
