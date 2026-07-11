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

Tiny Bitty Version 1 sells cookie products only. Bundles and corporate gifts remain in scope as cookie-based order journeys. Non-cookie product categories, navigation, routes, analytics events, SEO metadata, and homepage sections should be removed rather than hidden.
