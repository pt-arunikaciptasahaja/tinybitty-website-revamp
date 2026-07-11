import type { Bundle, Money, Product } from "@/content/schemas";

export type PriceComparison = {
  current: Money;
  compareAt?: Money;
  savings?: Money;
  savingsPercent?: number;
};

export type BundleSavings = {
  normalPrice: Money;
  bundlePrice: Money;
  savings: Money;
  savingsPercent: number;
};

function assertSameCurrency(left: Money, right: Money): void {
  if (left.currency !== right.currency) {
    throw new Error("Cannot compare prices with different currencies.");
  }
}

export function comparePrice(current: Money, compareAt?: Money): PriceComparison {
  if (!compareAt) {
    return { current };
  }

  assertSameCurrency(current, compareAt);

  if (compareAt.amount <= current.amount) {
    throw new Error("Compare-at price must exceed current price.");
  }

  const savingsAmount = compareAt.amount - current.amount;

  return {
    current,
    compareAt,
    savings: {
      amount: savingsAmount,
      currency: current.currency,
    },
    savingsPercent: Math.round((savingsAmount / compareAt.amount) * 100),
  };
}

export function calculateBundleSavings(bundle: Bundle): BundleSavings | null {
  if (!bundle.normalPrice || !bundle.bundlePrice) {
    return null;
  }

  assertSameCurrency(bundle.normalPrice, bundle.bundlePrice);

  if (bundle.bundlePrice.amount > bundle.normalPrice.amount) {
    throw new Error("Bundle price must not exceed normal total price.");
  }

  const savingsAmount = bundle.normalPrice.amount - bundle.bundlePrice.amount;

  return {
    normalPrice: bundle.normalPrice,
    bundlePrice: bundle.bundlePrice,
    savings: {
      amount: savingsAmount,
      currency: bundle.bundlePrice.currency,
    },
    savingsPercent:
      bundle.normalPrice.amount === 0
        ? 0
        : Math.round((savingsAmount / bundle.normalPrice.amount) * 100),
  };
}

export function calculateBundleNormalPrice(
  bundle: Bundle,
  products: readonly Product[],
): Money | null {
  if (bundle.includedItems.length === 0) {
    return null;
  }

  let total = 0;
  let currency: Money["currency"] | null = null;

  for (const item of bundle.includedItems) {
    const product = products.find((record) => record.id === item.productId);
    const variant = product?.variants.find((record) => record.id === item.variantId);

    if (!variant) {
      throw new Error(
        `Bundle item references an unknown product variant: ${item.productId}/${item.variantId}`,
      );
    }

    if (currency && currency !== variant.price.currency) {
      throw new Error("Cannot total bundle items with different currencies.");
    }

    currency = variant.price.currency;
    total += variant.price.amount * item.quantity;
  }

  return {
    amount: total,
    currency: currency ?? "IDR",
  };
}
