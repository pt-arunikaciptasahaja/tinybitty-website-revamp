import { describe, expect, it } from "vitest";
import type { Bundle, Product } from "@/content/schemas";
import { PLACEHOLDER_NOTICE } from "@/content/schemas";
import { calculateBundleNormalPrice, calculateBundleSavings, comparePrice } from "@/lib/pricing";

const money = (amount: number) => ({ amount, currency: "IDR" as const });

describe("pricing utilities", () => {
  it("returns no comparison when compare-at price is missing", () => {
    expect(comparePrice(money(100))).toEqual({ current: money(100) });
  });

  it("calculates price savings", () => {
    expect(comparePrice(money(80), money(100))).toEqual({
      current: money(80),
      compareAt: money(100),
      savings: money(20),
      savingsPercent: 20,
    });
  });

  it("rejects invalid compare-at prices", () => {
    expect(() => comparePrice(money(100), money(80))).toThrow("Compare-at price must exceed");
  });

  it("returns null bundle savings when source prices are missing", () => {
    expect(
      calculateBundleSavings(makeBundle({ normalPrice: undefined, bundlePrice: undefined })),
    ).toBeNull();
  });

  it("calculates bundle savings only from provided source prices", () => {
    expect(
      calculateBundleSavings(
        makeBundle({
          normalPrice: money(100000),
          bundlePrice: money(85000),
        }),
      ),
    ).toEqual({
      normalPrice: money(100000),
      bundlePrice: money(85000),
      savings: money(15000),
      savingsPercent: 15,
    });
  });

  it("totals bundle normal price from known product variants", () => {
    const product = makeProduct();
    const bundle = makeBundle({
      includedItems: [
        { productId: product.id, variantId: product.variants[0]?.id ?? "", quantity: 2 },
      ],
    });

    expect(calculateBundleNormalPrice(bundle, [product])).toEqual(money(50000));
  });

  it("rejects unknown bundle variant references", () => {
    const bundle = makeBundle({
      includedItems: [{ productId: "unknown-product", variantId: "unknown-variant", quantity: 1 }],
    });

    expect(() => calculateBundleNormalPrice(bundle, [makeProduct()])).toThrow(
      "unknown product variant",
    );
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
