# Release Runbook

## Preflight

Run these checks before promoting a build:

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Run Lighthouse against representative production or preview URLs for `/`, `/cookies`, `/cart`, and `/corporate-gifts`.

## Required Production Configuration

Set these public environment variables in the deployment platform when available:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_TIKTOK_PIXEL_ID`

Analytics IDs are optional. `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_WHATSAPP_NUMBER` are required for launch-ready canonical URLs and WhatsApp conversion links.

## Deployment

Use the deployment platform's preview build first. Verify:

- The preview build passes all checks.
- No production page exposes `[OWNER_INPUT_REQUIRED]`.
- WhatsApp links open the expected `wa.me` URL with a structured message.
- Corporate form delivery uses an approved lead-delivery adapter or intentionally falls back to WhatsApp.
- Sitemap and robots output use the production domain.

## Rollback

If a production issue is found:

1. Revert to the last known-good deployment in the deployment platform.
2. Disable newly added analytics pixel IDs if they caused tracking or script errors.
3. Restore the previous environment variable values if configuration caused the issue.
4. Re-run smoke checks on `/`, `/cookies`, `/cart`, `/corporate-gifts`, `/privacy`, and `/terms`.
5. Record the failed deployment URL, root cause, and recovery action before attempting another promotion.
