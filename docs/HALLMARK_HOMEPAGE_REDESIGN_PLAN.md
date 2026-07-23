# Hallmark Homepage Redesign Plan

## Scope

Redesign the `/` homepage using the structural and motion DNA studied from
`https://www.usehallmark.com/examples/hum-07/`.

## Preserve

- Approved Tiny Bitty product, bundle, delivery, corporate, and FAQ content
- Existing catalogue, corporate-gift, cart, and WhatsApp journeys
- Typed analytics events and payloads
- Existing App Router component ownership and content modules
- Mobile-first behavior and reduced-motion support

## Implement

1. Replace the photographic overlay hero with a light, product-led marquee hero.
2. Introduce a compact journey rail for catalogue → sweetness → bundles → WhatsApp.
3. Recompose homepage content into varied editorial sections, product cards, ordering steps,
   corporate gifting, FAQ, and a statement CTA.
4. Add dependency-free motion:
   - hero entrance stagger
   - scroll-triggered section and card reveals
   - ordering-step node pop and connector growth
   - compact sticky navigation after scroll
   - restrained product-image and CTA hover movement
5. Preserve full content accessibility when JavaScript is unavailable and disable spatial motion
   under `prefers-reduced-motion`.

## Verification

- Unit tests for crawlable content and analytics
- Playwright homepage journey at mobile and desktop widths
- Hallmark mobile checks at 320, 375, 414, and 768 px
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
