# Repository Audit

Audit date: 2026-07-11

## Current State

- Framework: Next.js App Router.
- Language: TypeScript with strict mode enabled.
- Styling: Tailwind CSS with central brand CSS variables.
- Package manager: `pnpm`.
- Tests: Vitest unit tests and Playwright E2E setup.
- CI: GitHub Actions workflow for lint, typecheck, tests, and build.
- Content strategy: repository-owned TypeScript content under `src/content`.
- Runtime integrations: none.

## Foundation Already Present

- `src/app` contains the target route skeleton.
- `src/content` contains initial typed content modules.
- `src/lib/analytics.ts` defines typed analytics event names.
- `src/lib/whatsapp.ts` builds WhatsApp messages and encoded URLs.
- `src/lib/money.ts` formats integer rupiah amounts.
- Unit tests cover product validation, money formatting, and WhatsApp URL/message behavior.
- E2E tests verify the homepage exposes primary journeys.

## Gaps To Address Later

- Replace placeholder content with owner-approved catalogue, business, delivery, legal, and analytics values.
- Implement cart persistence, checkout form validation, quantity controls, and WhatsApp enquiry flow.
- Add product detail structured data only when real product data is available.
- Add analytics provider adapters after GA4, Meta Pixel, and TikTok Pixel IDs exist.
- Add visual QA once the real homepage and product pages are designed.

## Foundation Decision

No dependencies were removed. No database, CMS, payment gateway, admin dashboard, or redesign work belongs in this phase.
