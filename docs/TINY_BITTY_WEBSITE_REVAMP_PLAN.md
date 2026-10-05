# Tiny Bitty Website Revamp Plan

This repository follows the approved Tiny Bitty revamp direction:

- Build a fast, mobile-first catalogue with WhatsApp checkout.
- Separate Cookies, Bundles, Corporate Gifts, About, Reviews, Delivery, FAQ, Contact, Privacy, and Terms journeys.
- Use Next.js App Router, TypeScript, Tailwind CSS, repository-based content, Vitest, React Testing Library, Playwright, ESLint, and Prettier.
- Keep Version 1 free of databases, CMS integrations, admin dashboards, payment gateways, and heavy animation libraries.
- Keep business content in `src/content`.
- Keep analytics behind typed utilities.
- Keep WhatsApp message construction in pure tested utilities.
- Do not publish unapproved business claims.

## Target Routes

```text
/
├── /cookies
│   └── /cookies/[slug]
├── /bundles
│   └── /bundles/[slug]
├── /corporate-gifts
├── /about
├── /reviews
├── /delivery
├── /faq
├── /contact
├── /privacy
└── /terms
```

## Foundation Phase Scope

The foundation phase establishes tooling, tests, CI, folder architecture, and safe placeholder content. It does not redesign the homepage, implement cart behavior, connect analytics pixels, add a database, add a CMS, or add payments.

## Product Scope Update

The juice launch extends Version 1 with /juices and /juices/[slug] enquiry-only catalogue pages. Cookies, cookie bundles, and corporate gifts remain supported. Juice has separate product information and no cookie sweetness or bundle discounts. See JUICE_LAUNCH_PLAN.md.
