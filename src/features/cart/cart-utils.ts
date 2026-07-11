import type { Bundle, Product, ProductVariant } from "@/content/schemas";
import type { WhatsAppLineItem } from "@/lib/whatsapp";
import type { CartItem, CartSnapshot } from "@/features/cart/cart-types";

export const CART_STORAGE_KEY = "tinybitty.cart.v1";

export function createProductCartItem(
  product: Product,
  variant: ProductVariant,
  quantity: number,
): CartItem {
  return {
    id: productCartItemId(product.id, variant.id),
    kind: "product",
    productId: product.id,
    variantId: variant.id,
    label: product.name,
    detail: variant.label,
    unitPrice: variant.price.amount,
    quantity: sanitizeQuantity(quantity),
  };
}

export function createBundleCartItem(bundle: Bundle, quantity: number): CartItem | null {
  if (!bundle.bundlePrice) {
    return null;
  }

  return {
    id: bundleCartItemId(bundle.id),
    kind: "bundle",
    bundleId: bundle.id,
    label: bundle.name,
    detail: "Bundle",
    unitPrice: bundle.bundlePrice.amount,
    quantity: sanitizeQuantity(quantity),
  };
}

export function addCartItem(items: readonly CartItem[], item: CartItem): CartItem[] {
  const existingItem = items.find((currentItem) => currentItem.id === item.id);

  if (!existingItem) {
    return [...items, item];
  }

  return items.map((currentItem) =>
    currentItem.id === item.id
      ? { ...currentItem, quantity: currentItem.quantity + item.quantity }
      : currentItem,
  );
}

export function updateCartItemQuantity(
  items: readonly CartItem[],
  itemId: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) {
    return removeCartItem(items, itemId);
  }

  return items.map((item) =>
    item.id === itemId ? { ...item, quantity: sanitizeQuantity(quantity) } : item,
  );
}

export function removeCartItem(items: readonly CartItem[], itemId: string): CartItem[] {
  return items.filter((item) => item.id !== itemId);
}

export function calculateCartSubtotal(items: readonly CartItem[]): number {
  return items.reduce((subtotal, item) => subtotal + item.unitPrice * item.quantity, 0);
}

export function toWhatsAppLineItems(items: readonly CartItem[]): WhatsAppLineItem[] {
  return items.map((item) => ({
    label: item.label,
    ...(item.detail ? { detail: item.detail } : {}),
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.unitPrice * item.quantity,
  }));
}

export function serializeCart(snapshot: CartSnapshot): string {
  return JSON.stringify({ items: snapshot.items });
}

export function parseStoredCart(value: string | null): CartSnapshot {
  if (!value) {
    return { items: [] };
  }

  try {
    const parsedValue: unknown = JSON.parse(value);

    if (!isCartSnapshot(parsedValue)) {
      return { items: [] };
    }

    return {
      items: parsedValue.items.map((item) => ({
        ...item,
        quantity: sanitizeQuantity(item.quantity),
        unitPrice: Math.max(0, Math.trunc(item.unitPrice)),
      })),
    };
  } catch {
    return { items: [] };
  }
}

export function productCartItemId(productId: string, variantId: string): string {
  return `product:${productId}:${variantId}`;
}

export function bundleCartItemId(bundleId: string): string {
  return `bundle:${bundleId}`;
}

function sanitizeQuantity(quantity: number): number {
  return Math.max(1, Math.trunc(quantity));
}

function isCartSnapshot(value: unknown): value is CartSnapshot {
  if (!value || typeof value !== "object" || !("items" in value)) {
    return false;
  }

  const candidate = value as { items: unknown };

  return Array.isArray(candidate.items) && candidate.items.every(isCartItem);
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CartItem>;

  return (
    typeof candidate.id === "string" &&
    (candidate.kind === "product" || candidate.kind === "bundle") &&
    typeof candidate.label === "string" &&
    typeof candidate.unitPrice === "number" &&
    Number.isFinite(candidate.unitPrice) &&
    typeof candidate.quantity === "number" &&
    Number.isFinite(candidate.quantity)
  );
}
