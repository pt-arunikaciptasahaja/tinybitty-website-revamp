import type { Bundle } from "@/content/schemas";
import { validateBundles } from "@/content/validation";

const BUNDLE_DISCOUNT_AMOUNT = 5000;

const bundleSizes = [
  {
    id: "sweet-sharing-bundle",
    slug: "sweet-sharing-bundle",
    name: "Sweet Sharing Mini Bundle",
    sizeLabel: "Mini 30gr",
    variantIds: ["golden-crunch-mini", "heavenly-bites-mini", "harvest-haven-mini"],
    normalPrice: 60000,
  },
  {
    id: "sweet-sharing-small-bundle",
    slug: "sweet-sharing-small-bundle",
    name: "Sweet Sharing Small Bundle",
    sizeLabel: "Small 100gr",
    variantIds: ["golden-crunch-small", "heavenly-bites-small", "harvest-haven-small"],
    normalPrice: 195000,
  },
  {
    id: "sweet-sharing-medium-bundle",
    slug: "sweet-sharing-medium-bundle",
    name: "Sweet Sharing Medium Bundle",
    sizeLabel: "Medium 150gr",
    variantIds: ["golden-crunch-medium", "heavenly-bites-medium", "harvest-haven-medium"],
    normalPrice: 255000,
  },
  {
    id: "sweet-sharing-large-bundle",
    slug: "sweet-sharing-large-bundle",
    name: "Sweet Sharing Large Bundle",
    sizeLabel: "Large 400gr",
    variantIds: ["golden-crunch-large", "heavenly-bites-large", "harvest-haven-large"],
    normalPrice: 660000,
  },
] as const;

const bundleFixtures = bundleSizes.map((size) => ({
  contentStatus: "approved",
  id: size.id,
  slug: size.slug,
  name: size.name,
  description: `A ${size.sizeLabel} bundle with Golden Crunch, Heavenly Bites, and Harvest Haven for sharing at home, in the office, or as a thoughtful gift.`,
  includedItems: [
    { productId: "almond-crunch", variantId: size.variantIds[0], quantity: 1 },
    { productId: "dark-crumbs", variantId: size.variantIds[1], quantity: 1 },
    { productId: "oatmeal-raisin", variantId: size.variantIds[2], quantity: 1 },
  ],
  normalPrice: { amount: size.normalPrice, currency: "IDR" },
  bundlePrice: { amount: size.normalPrice - BUNDLE_DISCOUNT_AMOUNT, currency: "IDR" },
  occasion: "Great for office breaks, small celebrations, and thoughtful gifting",
  customization: "Ask us about a custom mix of cookie flavors and packaging",
  leadTime: "1 day notice before 12:00 WIB",
  status: "active",
  seo: {
    title: `${size.name} | Tiny Bitty`,
    description: `Order a ${size.sizeLabel} Sweet Sharing Bundle with Tiny Bitty cookies for gifting or office treats.`,
  },
})) satisfies Bundle[];

export const bundles = validateBundles(bundleFixtures);
