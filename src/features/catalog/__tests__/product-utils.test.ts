import { describe, expect, it } from "vitest";
import type { Product } from "@/content/schemas";
import { PLACEHOLDER_NOTICE } from "@/content/schemas";
import {
  assertActiveProductsHaveActiveVariants,
  getActiveVariant,
  getProductAvailability,
  getProductBySlug,
  getRelatedProducts,
  getSelectableVariants,
  toAnalyticsItem,
} from "@/features/catalog/product-utils";

describe("product catalog utilities", () => {
  it("derives availability from variants", () => {
    expect(getProductAvailability(makeProduct({ variantStatus: "active" }))).toBe("active");
    expect(getProductAvailability(makeProduct({ variantStatus: "sold_out" }))).toBe("sold_out");
    expect(getProductAvailability(makeProduct({ variantStatus: "coming_soon" }))).toBe(
      "coming_soon",
    );
  });

  it("returns active/selectable variants only", () => {
    const product = makeProduct({ variantStatus: "active" });

    expect(getActiveVariant(product)?.id).toBe("test-variant");
    expect(getSelectableVariants(product)).toHaveLength(1);
  });

  it("finds products and related products by category", () => {
    const product = makeProduct({ id: "one", slug: "one" });
    const related = makeProduct({ id: "two", slug: "two" });
    const other = makeProduct({ id: "three", slug: "three" });

    expect(getProductBySlug([product, related], "one")?.id).toBe("one");
    expect(getRelatedProducts([product, related, other], product, 1)).toEqual([related]);
  });

  it("requires approved active products to include an active variant", () => {
    expect(() =>
      assertActiveProductsHaveActiveVariants([
        makeProduct({
          contentStatus: "approved",
          status: "active",
          variantStatus: "coming_soon",
        }),
      ]),
    ).toThrow("Approved active products must have active variants");
  });

  it("builds analytics items without undefined optional fields", () => {
    expect(toAnalyticsItem(makeProduct({ variantStatus: "coming_soon" }))).toEqual({
      item_id: "test-product",
      item_name: "[OWNER_INPUT_REQUIRED]",
      item_category: "cookies",
    });
  });
});

function makeProduct(
  overrides: {
    id?: string;
    slug?: string;
    category?: Product["category"];
    contentStatus?: Product["contentStatus"];
    status?: Product["status"];
    variantStatus?: Product["variants"][number]["status"];
  } = {},
): Product {
  const contentStatus = overrides.contentStatus ?? "placeholder";

  return {
    contentStatus,
    ...(contentStatus === "placeholder" ? { placeholderNotice: PLACEHOLDER_NOTICE } : {}),
    id: overrides.id ?? "test-product",
    slug: overrides.slug ?? "test-product",
    category: overrides.category ?? "cookies",
    status: overrides.status ?? "coming_soon",
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
        price: { amount: 0, currency: "IDR" },
        status: overrides.variantStatus ?? "coming_soon",
      },
    ],
    seo: {
      title: "[OWNER_INPUT_REQUIRED]",
      description: "[OWNER_INPUT_REQUIRED]",
    },
  };
}
