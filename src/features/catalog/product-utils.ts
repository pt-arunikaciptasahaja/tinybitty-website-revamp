import type { Product, ProductVariant } from "@/content/schemas";
import type { AnalyticsItem } from "@/lib/analytics";

export type ProductAvailability = "active" | "sold_out" | "coming_soon";

export function getActiveVariant(product: Product): ProductVariant | null {
  return product.variants.find((variant) => variant.status === "active") ?? null;
}

export function getProductAvailability(product: Product): ProductAvailability {
  if (product.variants.some((variant) => variant.status === "active")) {
    return "active";
  }

  if (product.variants.some((variant) => variant.status === "sold_out")) {
    return "sold_out";
  }

  return "coming_soon";
}

export function getProductBySlug(products: readonly Product[], slug: string): Product | null {
  return products.find((product) => product.slug === slug) ?? null;
}

export function getRelatedProducts(
  products: readonly Product[],
  product: Product,
  limit = 3,
): Product[] {
  return products
    .filter((candidate) => candidate.category === product.category && candidate.id !== product.id)
    .slice(0, limit);
}

export function getSelectableVariants(product: Product): ProductVariant[] {
  return product.variants.filter((variant) => variant.status === "active");
}

export function assertActiveProductsHaveActiveVariants(products: readonly Product[]): void {
  const invalidProducts = products.filter(
    (product) =>
      product.contentStatus === "approved" &&
      product.status === "active" &&
      !getActiveVariant(product),
  );

  if (invalidProducts.length > 0) {
    throw new Error(
      `Approved active products must have active variants: ${invalidProducts
        .map((product) => product.slug)
        .join(", ")}`,
    );
  }
}

export function toAnalyticsItem(
  product: Product,
  variant = getActiveVariant(product),
): AnalyticsItem {
  return {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    ...(variant ? { item_variant: variant.label, price: variant.price.amount } : {}),
  };
}
