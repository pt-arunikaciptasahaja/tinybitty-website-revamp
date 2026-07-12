import { describe, expect, it } from "vitest";
import type { Bundle, Product } from "@/content/schemas";
import { bundles } from "@/content/bundles";
import { products } from "@/content/products";
import { PLACEHOLDER_NOTICE } from "@/content/schemas";
import {
  getBundleAvailability,
  getBundleBySlug,
  resolveBundlePricing,
  toBundleAnalyticsItem,
} from "@/features/bundles/bundle-utils";

const money = (amount: number) => ({ amount, currency: "IDR" as const });

describe("bundle utilities", () => {
  it("finds bundle records and exposes availability", () => {
    const bundle = makeBundle({ status: "active" });

    expect(getBundleBySlug([bundle], "test-bundle")?.id).toBe("test-bundle");
    expect(getBundleAvailability(bundle)).toBe("active");
  });

  it("does not display savings when source prices are missing", () => {
    expect(resolveBundlePricing(makeBundle(), [makeProduct()])).toEqual({
      sourceNormalPrice: null,
      savings: null,
      canDisplaySavings: false,
    });
  });

  it("calculates source normal price and savings from included products", () => {
    const product = makeProduct();
    const bundle = makeBundle({
      includedItems: [
        { productId: product.id, variantId: product.variants[0]?.id ?? "", quantity: 2 },
      ],
      bundlePrice: money(40000),
    });

    expect(resolveBundlePricing(bundle, [product])).toEqual({
      sourceNormalPrice: money(50000),
      savings: {
        normalPrice: money(50000),
        bundlePrice: money(40000),
        savings: money(10000),
        savingsPercent: 20,
      },
      canDisplaySavings: true,
    });
  });

  it("applies the approved IDR 5,000 discount to every Sweet Sharing Bundle size", () => {
    expect(bundles).toHaveLength(4);

    for (const bundle of bundles) {
      const pricing = resolveBundlePricing(bundle, products);

      expect(bundle.includedItems).toHaveLength(3);
      expect(bundle.includedItems.some((item) => item.productId === "Desert-Crown")).toBe(false);
      expect(pricing.sourceNormalPrice).toEqual(bundle.normalPrice);
      expect(pricing.savings?.bundlePrice).toEqual(bundle.bundlePrice);
      expect(pricing.savings?.savings).toEqual(money(5000));
      expect(pricing.canDisplaySavings).toBe(true);
    }
  });

  it("builds analytics items without undefined prices", () => {
    expect(toBundleAnalyticsItem(makeBundle())).toEqual({
      item_id: "test-bundle",
      item_name: "[OWNER_INPUT_REQUIRED]",
      item_category: "bundle",
    });
  });
});

function makeBundle(overrides: Partial<Bundle> = {}): Bundle {
  return {
    contentStatus: "placeholder",
    placeholderNotice: PLACEHOLDER_NOTICE,
    id: "test-bundle",
    slug: "test-bundle",
    name: "[OWNER_INPUT_REQUIRED]",
    description: "[OWNER_INPUT_REQUIRED]",
    includedItems: [],
    status: "draft",
    seo: {
      title: "[OWNER_INPUT_REQUIRED]",
      description: "[OWNER_INPUT_REQUIRED]",
    },
    ...overrides,
  };
}

function makeProduct(): Product {
  return {
    contentStatus: "placeholder",
    placeholderNotice: PLACEHOLDER_NOTICE,
    id: "test-product",
    slug: "test-product",
    category: "cookies",
    status: "coming_soon",
    name: "[OWNER_INPUT_REQUIRED]",
    shortDescription: "[OWNER_INPUT_REQUIRED]",
    description: "[OWNER_INPUT_REQUIRED]",
    images: [
      {
        src: "/placeholder.svg",
        alt: "[OWNER_INPUT_REQUIRED]",
        width: 1,
        height: 1,
      },
    ],
    ingredients: ["[OWNER_INPUT_REQUIRED]"],
    allergens: ["[OWNER_INPUT_REQUIRED]"],
    featured: false,
    variants: [
      {
        id: "test-variant",
        label: "[OWNER_INPUT_REQUIRED]",
        price: money(25000),
        status: "coming_soon",
      },
    ],
    seo: {
      title: "[OWNER_INPUT_REQUIRED]",
      description: "[OWNER_INPUT_REQUIRED]",
    },
  };
}
