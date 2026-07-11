import type { AnalyticsItem } from "@/lib/analytics";
import type { Bundle, Product } from "@/content/schemas";
import {
  calculateBundleNormalPrice,
  calculateBundleSavings,
  type BundleSavings,
} from "@/lib/pricing";

export type BundleAvailability = "active" | "sold_out" | "draft";

export type BundlePricing = {
  sourceNormalPrice: ReturnType<typeof calculateBundleNormalPrice>;
  savings: BundleSavings | null;
  canDisplaySavings: boolean;
};

export function getBundleBySlug(bundles: readonly Bundle[], slug: string): Bundle | null {
  return bundles.find((bundle) => bundle.slug === slug) ?? null;
}

export function getBundleAvailability(bundle: Bundle): BundleAvailability {
  return bundle.status;
}

export function resolveBundlePricing(bundle: Bundle, products: readonly Product[]): BundlePricing {
  const sourceNormalPrice = calculateBundleNormalPrice(bundle, products);

  if (!sourceNormalPrice || !bundle.bundlePrice) {
    return {
      sourceNormalPrice,
      savings: null,
      canDisplaySavings: false,
    };
  }

  const savings = calculateBundleSavings({
    ...bundle,
    normalPrice: sourceNormalPrice,
    bundlePrice: bundle.bundlePrice,
  });

  return {
    sourceNormalPrice,
    savings,
    canDisplaySavings: Boolean(savings && savings.savings.amount > 0),
  };
}

export function toBundleAnalyticsItem(bundle: Bundle): AnalyticsItem {
  return {
    item_id: bundle.id,
    item_name: bundle.name,
    item_category: "bundle",
    ...(bundle.bundlePrice ? { price: bundle.bundlePrice.amount } : {}),
  };
}
