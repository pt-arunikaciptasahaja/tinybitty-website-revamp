# AGENTS.md

## Project

Tiny Bitty is a mobile-first Indonesian food-commerce catalogue for cookies, bundles, and corporate gifts. The main conversion is a structured WhatsApp enquiry.

Read `docs/TINY_BITTY_WEBSITE_REVAMP_PLAN.md` before making architectural or product-flow changes.

## Working Method

- Inspect the repository before editing.
- For work affecting more than three files or one user journey, write or update a concise implementation plan before coding.
- Make focused changes that can be reviewed independently.
- Do not rewrite unrelated code.
- Explain new production dependencies before adding them.
- Preserve working behavior unless the task explicitly changes it.
- After implementation, review the diff and report tests executed.

## Required Commands

Use `pnpm`.

Before considering a task complete, run the relevant commands:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For user-flow changes, also run the relevant Playwright tests.

Do not report success when a required check has failed. State the failure and its likely cause.

## Architecture

- Use Next.js App Router and TypeScript.
- Prefer React Server Components.
- Add `"use client"` only when state, effects, browser APIs, or interactive event handlers require it.
- Keep business content separate from presentation components.
- Keep analytics calls behind a typed analytics module.
- Keep WhatsApp message construction in a pure tested utility.
- Keep product and bundle records typed and runtime-validated.
- Avoid global mutable state.
- Avoid a backend or database until the task explicitly requires one.
- Do not build an admin dashboard in Version 1.
- Do not add a payment gateway in Version 1.

## Content Integrity

- Never invent product prices, ingredients, allergens, certifications, delivery areas, ratings, review counts, testimonials, client names, stock, or health claims.
- Mark missing business content with `[OWNER_INPUT_REQUIRED]` in source content.
- Do not expose internal placeholders in production builds.
- Do not calculate savings unless source prices exist and the arithmetic is tested.

## Analytics

- Use typed event names and payloads.
- Do not send customer addresses, phone numbers, free-text notes, or other personal data to analytics.
- Treat WhatsApp checkout as `begin_checkout` or `generate_lead`, not `purchase`.

## Completion Report

At the end of a task, summarize:

1. What changed
2. Files changed
3. Decisions or assumptions
4. Tests/checks run
5. Remaining owner inputs
6. Risks or follow-up work
