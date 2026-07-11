import type { Bundle } from "@/content/schemas";
import { validateBundles } from "@/content/validation";

const bundleFixtures = [
  {
    contentStatus: "approved",
    id: "sweet-sharing-bundle",
    slug: "sweet-sharing-bundle",
    name: "Sweet Sharing Bundle",
    description:
      "A curated mix of Tiny Bitty cookies for sharing at home, in the office, or as a thoughtful gift.",
    includedItems: [
      { productId: "almond-crunch", variantId: "golden-crunch-mini", quantity: 2 },
      { productId: "dark-crumbs", variantId: "heavenly-bites-mini", quantity: 2 },
    ],
    occasion: "Great for office breaks, small celebrations, and thoughtful gifting",
    customization: "Ask us about a custom mix of cookie flavors and packaging",
    leadTime: "1 day notice for ready-to-ship orders",
    status: "active",
    seo: {
      title: "Sweet Sharing Bundle | Tiny Bitty",
      description: "Order a Sweet Sharing Bundle with a mix of Tiny Bitty cookies for gifting or office treats.",
    },
  },
] satisfies Bundle[];

export const bundles = validateBundles(bundleFixtures);
