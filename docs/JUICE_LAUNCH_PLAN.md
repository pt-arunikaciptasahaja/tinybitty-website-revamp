# Juice launch implementation plan

- Extend the repository catalogue with runtime-validated enquiry-only juice records. Reference names are provisional; volume, prices, ingredients, allergens, availability, storage, shelf life and delivery require owner confirmation.
- Add the supplied group image without cropping; update the static homepage hero and insert the juice grid before the cookie shelf using existing brand tokens.
- Add /juices and /juices/[slug], shared navigation and sitemap metadata. Reuse container, buttons, breadcrumbs and quantity controls; omit Product JSON-LD until verified.
- Extend the existing mixed cart with nullable juice pricing, safe persistence, and WhatsApp enquiry lines. Exclude unpriced items from known subtotals; do not apply cookie delivery assumptions, discounts or sweetness to juice.
- Add unit and browser regression coverage, run lint/typecheck/test/build and Playwright, and prepare a local review preview. Production deployment is outside this implementation.

Files: src/content/{index,juices,site-config}.ts; src/components/home/HomePageSections.tsx; src/components/layout/{Header,MobileMenu}.tsx; src/features/juices/*; src/features/catalog/QuantitySelector.tsx; src/features/cart/{CartProvider.tsx,cart-types.ts,cart-utils.ts}; src/features/checkout/CheckoutForm.tsx; src/lib/{seo,whatsapp}.ts; src/app/{globals.css,sitemap.ts,juices/**}; affected unit and e2e tests; public/juice-launch.jpg. No deletions or new dependencies.


## Review and validation

Local production preview: http://127.0.0.1:3000 (started with corepack pnpm exec next start --hostname 127.0.0.1 --port 3000). No production deployment performed.

- pnpm lint: passed without warnings on the final implementation.
- pnpm typecheck: passed; final tsc --noEmit also passed after browser test additions.
- pnpm build: passed, including /juices and all four static detail pages.
- pnpm test: 89 passed, 4 failed in untouched corporate tests. Their future-date fixtures use 2026-08-01, now in the past; production date validation rejects them. Affected files: src/features/corporate/__tests__/actions.test.ts and CorporateEnquiryForm.test.tsx. The full suite is not green.
- Focused unit regressions after the saved-cart fix: 26 passed across homepage, quantity, checkout, cart, juice, and WhatsApp tests.
- Playwright: all 22 desktop/mobile tests passed. Coverage includes real cookie plus juice enquiries, persistence after reload without browser runtime errors, cookie-only checkout, bundles, all four juice details, unknown slug 404, keyboard focus/activation, hero CTAs, navigation, no broken juice images, and overflow checks at 320/375/414/768/1440 px.
- Visually inspected final desktop and mobile homepage screenshots under test-results/home-final-1440.png and home-final-375.png. Full group image retained; no individual crops or text overlays. Browser verification used repository Playwright because agent-browser CLI is unavailable.
- git diff --check: passed.

## Owner inputs and launch blockers

The supplied Gemini_Generated_Image_5kjfwv5kjfwv5kjf.jpg was found in Downloads and copied unchanged to public/juice-launch.jpg (2752 x 1536). Its labels visually match all four requested reference names and 250 ml. No existing business records independently confirm the specifications. Public copy therefore identifies names as references and volume as unconfirmed; volumeMl remains null. A confirmed volume is supported in the message utility and tested.

Before production launch, confirm final product names, volume, price, availability, ingredients, allergens, shelf life, storage, and delivery terms. Missing information is marked with OWNER_INPUT_REQUIRED in source, removed from public record props, and represented publicly as an enquiry. No Product structured data is emitted for juice. No price is represented as zero; juice is excluded from known-price subtotals and mixed-order delivery/final payment require quotation. Cookie-only totals and bundle pricing remain unchanged.

Resolve or separately accept the four existing corporate test failures before treating the full project checks as green. The preview has not sent a WhatsApp message or placed an order.

The browser regression uncovered a saved-cart hydration mismatch. CartProvider now restores local storage after hydration and waits before persisting, preventing an empty server snapshot from overwriting saved enquiries. The Playwright server command was made portable on Windows using an env map. No new production dependencies were added.

## Hero visual refinement

- Enlarge the desktop hero container and give the image composition a greater share of the layout.
- Add a server-rendered HeroCollectionVisual with the complete supplied four-bottle image and two existing, approved cookie product photos. Place cookie photos below the bottles, so no product or label is obscured.
- Preserve current typography, palette, hero copy, and CTAs. Use a two-column cookie pairing shelf on mobile with readable labels and clear keyboard links.
- Files: src/components/home/HeroCollectionVisual.tsx, HomePageSections.tsx, src/app/globals.css, homepage unit test, and this plan. No new dependencies or raster image edits.
- Run lint, typecheck, unit tests, build, and relevant Playwright tests. Review desktop/mobile screenshots before handoff.

### Hero refinement validation

The updated hero combines the supplied full juice group photograph with approved Golden Crunch and Heavenly Bites product photos. The desktop visual occupies 65% of the hero grid and the juice photograph renders at approximately 768 px wide at a 1440 px viewport. Cookie links sit beneath the image and do not obscure the four bottles. The wider hero uses the existing brand tokens, rounded frames and restrained shadows; mobile keeps the CTAs before the composition.

Changed files: src/components/home/HeroCollectionVisual.tsx (new), HomePageSections.tsx, src/app/globals.css, src/components/home/__tests__/HomePageSections.test.tsx, and this plan. No new dependencies or new business-content assumptions.

Checks: pnpm lint, pnpm typecheck, pnpm build and git diff --check passed. Full pnpm test: 89 passed and the same 4 existing corporate-date tests failed. The homepage tests, including the two cookie links, passed. All 14 relevant desktop/mobile Playwright tests passed against the separate production preview on http://127.0.0.1:3001. All three hero images were verified as loaded at 375, 768 and 1440 px with no horizontal overflow or runtime errors; the Playwright layout checks also covered 320 and 414 px. Desktop and mobile screenshots were inspected. Preview screenshots are under test-results/hero-refined-1440.png and hero-refined-375.png.

The original port 3000 server was left running. Production was not deployed. No new owner inputs are needed for this visual refinement; the previously documented juice specifications and four corporate test failures remain outstanding.
## Juice video header plan

Use the supplied MP4 as the main /juices header visual, keeping the homepage static. Reuse the group-image poster, native keyboard-accessible controls, inline playback, metadata-only preload and no autoplay. Keep text outside the video and product cards immediately below it. Add a download fallback for unsupported codecs. Validate poster/layout and actual playback in a codec-capable browser. No dependencies or product claims added.

## Replacement juice header image

Use public/Gemini_Generated_Image_nl64ldnl64ldnl64.jpg (2752 x 1536) through the central juiceLaunchImage record. This updates the homepage header, juice detail imagery and category video poster consistently, preserving all four bottles and Next.js image optimization. The supplied image was visually inspected. The poster browser assertion follows the new asset path. No changes to business information or ordering.

Replacement validation: lint passed with one pre-existing temporary-preview-config warning; typecheck and production build passed. Full unit suite: 89 passed, 4 existing corporate tests failed because their fixed desired date is in the past. Responsive Playwright checks passed at 375, 768 and 1440 px for homepage, juice category and juice detail pages, including loaded images, correct video poster and no horizontal overflow. Mobile screenshot inspected. Earlier preview attempts failed because the development server was unavailable; final verification used the rebuilt production preview at http://127.0.0.1:3002. No new owner inputs or dependencies; existing juice specification blockers remain.

## Individual juice card images plan

Extract four faithful bottle crops from public/juice-launch.jpg, preserving each bottle and its label without regenerating pixels. Store image records in the runtime-validated juice content. Render with Next.js Image in the shared collection cards on homepage and /juices; use contain sizing so bottles remain complete. Keep header visual and ordering unchanged. Inspect crops and check loaded images and overflow at 375, 768 and 1440 px, then run required checks.

Individual card validation: four 460 x 1220 WebP crops under public/juices were visually inspected; no neighboring bottles appear. Updated src/content/juices.ts, src/features/juices/JuiceCollection.tsx, src/app/globals.css and e2e/juices.spec.ts. Lint, typecheck, build and diff whitespace checks passed. Full unit suite: 89 passed, same 4 corporate-date fixture failures. Three responsive Playwright checks passed at 375, 768 and 1440 px, verifying all four images loaded on homepage and juice category, working navigation and no overflow. Desktop category screenshot inspected. Preview: http://127.0.0.1:3003/juices. No new dependencies or owner inputs; existing juice business-specification blockers remain. No production deployment.

## Square product images plan

Replace product crops with supplied 2048 x 2048 mango, strawberry, guava and soursop JPGs in central validated content. Use square contain frames on collection cards and the matching individual image on every juice detail page. Keep the group hero and video poster. Update responsive checks for detail images; run lint, typecheck, tests, build and browser layout checks. No new business claims or dependencies.

## Cookie-style juice cards plan

Match ProductCard's padding, border, shadow, title/status row, description, price position and pill View details link in the shared juice collection. Retain square supplied JPGs and the enquiry-only badge and pricing. Use the existing style classes without cookie variant logic or cookie analytics. Preserve the earlier square-image update on detail pages. Verify layouts and links in the rebuilt preview; rerun required checks.

Square images and card styling validation: product records use supplied 2048 x 2048 JPGs; all detail pages show the matching individual image. Collection cards match cookie ProductCard classes for image corners, surface, border, shadow, spacing, heading/badge, description, price and pill button. Enquiry-only product logic remains separate. Removed superseded juice-card layout CSS. Changed src/content/juices.ts, src/app/juices/[slug]/page.tsx, src/features/juices/JuiceCollection.tsx, src/app/globals.css, e2e/juices.spec.ts and this plan. Lint and typecheck passed. Build passed after correcting Windows source encoding. Full unit suite 89 passed / 4 existing corporate-date fixture failures; final homepage focused tests 3 passed. Four Playwright checks passed for 375, 768 and 1440 px plus keyboard navigation, with all images loaded and no overflow. Final desktop screenshot inspected. Preview http://127.0.0.1:3004/juices. No dependencies, new owner inputs or production deployment.

## Confirmed juice price and volume plan

Apply owner-confirmed Rp20,000 and 250 ml to all four juice records. Support verified and unknown pricing states without cookie options. Update cards/details, stored-cart restoration, subtotals and WhatsApp line items; retain delivery quotation. Remove obsolete unconfirmed-volume copy. Request confirmed ingredient lists before publishing ingredient claims. Test mixed totals, legacy saved carts and enquiry messages, then run required checks and browser flows.

Confirmed price/volume validation: all four products are Rp20,000 per 250 ml bottle per owner instruction. Updated source pricing states, card/detail price rendering, public volume copy, cart creation/restoration, generic unpriced subtotal labels, and WhatsApp messages. Saved null-price juice items restore at current catalogue pricing. Mixed cookie + 2 juice enquiry totals Rp260,000 and includes each juice at Rp20,000, 250 ml, quantity 2 and line total Rp40,000. Delivery/payment remain quotations. Added regression coverage for priced mixed totals and unpriced fallback. Lint, typecheck, build and whitespace checks passed. Full unit run: 89 passed, 5 failed (4 known corporate-date failures and a homepage timeout); focused rerun of homepage and juice tests passed all 9. Six Playwright tests passed including mixed enquiry, all detail prices/volumes, cookie bundle and 375/768/1440 layouts. Preview http://127.0.0.1:3005/juices. Ingredient lists requested from owner and still pending; ingredients remains null with OWNER_INPUT_REQUIRED in source. No ingredients or allergen facts invented. The old reference/volume placeholder copy was replaced with neutral flavor-name copy while awaiting recipes. Earlier price and volume blockers are now resolved. No deployment.

## Homepage cookie card parity plan

Reuse the homepage cookie-card classes and structure for juice: edge-to-edge square image, numbered body, title, description, volume/price line and ghost View details link. Preserve the required juice grid breakpoints. Replace repeated copy with four distinct name-based descriptions without unverified recipe or health claims. Validate loaded square images, links, focus and overflow; run project checks.

Homepage parity results: shared JuiceCollection now directly reuses cookie-card, cookie-card__image/body/index/description/price/link and the same ghost Button/cta-arrow as the homepage cookie shelf. Images meet the card edges, with no inset image padding or separate image corners. Four distinct product descriptions are stored centrally and also appear on details, without unsupported ingredient/health claims. Computed desktop card border, 24 px radius, zero outer padding, 24 px body padding and font matched the cookie shelf exactly; screenshot test-results/juice-cookie-style.png inspected. Changed src/features/juices/JuiceCollection.tsx, src/content/juices.ts and this plan; temporary preview config updated for port 3006. Lint, typecheck, production build and whitespace checks passed. Unit suite: 90 passed, 4 existing corporate-date failures. Four Playwright checks passed covering 375, 768, 1440 and keyboard navigation. Preview http://127.0.0.1:3006/. Ingredient recipes remain pending; no new dependencies or production deployment.
