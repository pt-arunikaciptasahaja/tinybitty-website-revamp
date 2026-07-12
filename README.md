# Tiny Bitty Website Revamp

Mobile-first catalogue and WhatsApp enquiry flow for Tiny Bitty cookies, bundles, and corporate gifts.

The current version is enquiry-first: customers review their order, open WhatsApp with a structured message, and Tiny Bitty confirms stock, delivery schedule, and payment before the order is final.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vitest and React Testing Library
- Playwright
- Repository-based content in `src/content`

## Getting Started

Install dependencies:

```bash
pnpm install
```

Copy environment variables:

```bash
cp .env.example .env.local
```

Set at minimum:

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=6281112010160
```

Run locally:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Before shipping changes, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For checkout or user-flow changes, also run the relevant Playwright tests.

## Environment Variables

Public variables:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp number for `wa.me` links, digits only, including country code.
- `NEXT_PUBLIC_SITE_URL`: production site URL.
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID`: optional GA4 measurement ID.
- `NEXT_PUBLIC_META_PIXEL_ID`: optional Meta Pixel ID.
- `NEXT_PUBLIC_TIKTOK_PIXEL_ID`: optional TikTok Pixel ID.

Do not put private credentials in public `NEXT_PUBLIC_*` variables.

## Content Rules

- Keep product, bundle, FAQ, corporate, and site content in `src/content`.
- Do not invent prices, ingredients, allergens, certifications, delivery areas, reviews, testimonials, stock, or health claims.
- Mark missing owner-supplied business content with `[OWNER_INPUT_REQUIRED]`.
- Do not expose internal placeholders in production.

## Checkout Notes

- Checkout creates a WhatsApp enquiry, not an automatic purchase.
- WhatsApp message construction lives in `src/lib/whatsapp.ts`.
- Delivery fee is currently a fixed flat fee in the checkout flow.
- Analytics must not receive customer names, phone numbers, addresses, notes, or free-text personal data.

## Useful Docs

- [Revamp plan](docs/TINY_BITTY_WEBSITE_REVAMP_PLAN.md)
- [Release runbook](docs/RELEASE_RUNBOOK.md)
- [Analytics debug validation](docs/ANALYTICS_DEBUG_VALIDATION.md)
- [Technical debt](docs/TECHNICAL_DEBT.md)
- [Next version: Google Sheets enquiry capture](docs/NEXT_VERSION_GOOGLE_SHEETS_ENQUIRY_CAPTURE.md)

## Next Planned Feature

The next planned operational feature is Google Sheets enquiry capture. See:

[docs/NEXT_VERSION_GOOGLE_SHEETS_ENQUIRY_CAPTURE.md](docs/NEXT_VERSION_GOOGLE_SHEETS_ENQUIRY_CAPTURE.md)

Keep this out of the current migration unless explicitly scoped.
