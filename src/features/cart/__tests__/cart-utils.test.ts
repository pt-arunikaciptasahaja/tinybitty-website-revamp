import { describe, expect, it } from "vitest";
import type { Bundle, Product } from "@/content/schemas";
import { PLACEHOLDER_NOTICE } from "@/content/schemas";
import {
  addCartItem,
  calculateCartSubtotal,
  createBundleCartItem,
  createProductCartItem,
  parseStoredCart,
  removeCartItem,
  toWhatsAppLineItems,
  updateCartItemQuantity,
} from "@/features/cart/cart-utils";

const money = (amount: number) => ({ amount, currency: "IDR" as const });

describe("cart utilities", () => {
  it("adds product variants and merges duplicate items", () => {
    const product = makeProduct();
    const variant = product.variants[0];

    if (!variant) {
      throw new Error("Expected product variant.");
    }

    const item = createProductCartItem(product, variant, 2);
    const items = addCartItem(addCartItem([], item), createProductCartItem(product, variant, 3));

    expect(items).toHaveLength(1);
    expect(items[0]?.quantity).toBe(5);
    expect(calculateCartSubtotal(items)).toBe(125000);
  });

  it("adds bundles only when a bundle price exists", () => {
    expect(createBundleCartItem(makeBundle({ bundlePrice: undefined }), 1)).toBeNull();

    const bundleItem = createBundleCartItem(makeBundle({ bundlePrice: money(80000) }), 2);

    expect(bundleItem).toMatchObject({
      id: "bundle:test-bundle",
      kind: "bundle",
      unitPrice: 80000,
      quantity: 2,
    });
  });

  it("updates quantity, removes items, and exports WhatsApp line items", () => {
    const product = makeProduct();
    const variant = product.variants[0];

    if (!variant) {
      throw new Error("Expected product variant.");
    }

    const item = createProductCartItem(product, variant, 1);
    const updatedItems = updateCartItemQuantity([item], item.id, 4);

    expect(calculateCartSubtotal(updatedItems)).toBe(100000);
    expect(toWhatsAppLineItems(updatedItems)).toEqual([
      {
        label: "[OWNER_INPUT_REQUIRED]",
        detail: "[OWNER_INPUT_REQUIRED]",
        quantity: 4,
        unitPrice: 25000,
        subtotal: 100000,
      },
    ]);
    expect(removeCartItem(updatedItems, item.id)).toEqual([]);
  });

  it("safely ignores invalid stored carts", () => {
    expect(parseStoredCart("not-json")).toEqual({ items: [] });
    expect(parseStoredCart(JSON.stringify({ items: [{ id: 1 }] }))).toEqual({ items: [] });
  });
});

function makeProduct(): Product {
  return {
    contentStatus: "placeholder",
    placeholderNotice: PLACEHOLDER_NOTICE,
    id: "test-product",
    slug: "test-product",
    category: "cookies",
    status: "active",
    name: "[OWNER_INPUT_REQUIRED]",
    shortDescription: "[OWNER_INPUT_REQUIRED]",
    description: "[OWNER_INPUT_REQUIRED]",
    images: [{ src: "/placeholder.svg", alt: "[OWNER_INPUT_REQUIRED]", width: 1, height: 1 }],
    ingredients: ["[OWNER_INPUT_REQUIRED]"],
    allergens: ["[OWNER_INPUT_REQUIRED]"],
    featured: false,
    variants: [
      {
        id: "test-variant",
        label: "[OWNER_INPUT_REQUIRED]",
        price: money(25000),
        status: "active",
      },
    ],
    seo: {
      title: "[OWNER_INPUT_REQUIRED]",
      description: "[OWNER_INPUT_REQUIRED]",
    },
  };
}

function makeBundle(overrides: Partial<Bundle> = {}): Bundle {
  return {
    contentStatus: "placeholder",
    placeholderNotice: PLACEHOLDER_NOTICE,
    id: "test-bundle",
    slug: "test-bundle",
    name: "[OWNER_INPUT_REQUIRED]",
    description: "[OWNER_INPUT_REQUIRED]",
    includedItems: [],
    status: "active",
    seo: {
      title: "[OWNER_INPUT_REQUIRED]",
      description: "[OWNER_INPUT_REQUIRED]",
    },
    ...overrides,
  };
}
