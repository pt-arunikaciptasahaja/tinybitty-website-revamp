# Analytics Debug Validation

Tiny Bitty sends analytics through `src/lib/analytics.ts`. The site is no-op by default until public provider IDs are configured.

## Environment variables

- `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_TIKTOK_PIXEL_ID`

When a public ID is present, the app loads the matching provider script and sends events through the typed analytics adapter. When an ID is absent, that provider is a no-op.

## Development validation

In non-production environments, every accepted event logs as:

```text
[analytics] event_name payload
```

Duplicate identical events fired within the short dedupe window are suppressed.

## Provider checks

- GA4 DebugView: confirm ecommerce-style events such as `view_item`, `add_to_cart`, `begin_checkout`, and `generate_lead`.
- Meta Pixel Helper: confirm mapped events such as `ViewContent`, `AddToCart`, `InitiateCheckout`, `Lead`, and `Contact`.
- TikTok Pixel Helper: confirm mapped events such as `ViewContent`, `AddToCart`, `InitiateCheckout`, `SubmitForm`, and `Contact`.

Analytics payloads intentionally exclude phone numbers, addresses, customer names, notes, and other personal data.
