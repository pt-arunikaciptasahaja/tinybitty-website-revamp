import type { Bundle, Product } from "@/content/schemas";
import { Price } from "@/components/ui/Price";
import { resolveBundlePricing, toBundleAnalyticsItem } from "@/features/bundles/bundle-utils";
import { IncludedItemsBreakdown } from "@/features/bundles/IncludedItemsBreakdown";
import { TrackedBundleLink } from "@/features/bundles/TrackedBundleLink";

type BundleCardProps = {
  bundle: Bundle;
  products: Product[];
};

export function BundleCard({ bundle, products }: BundleCardProps) {
  const pricing = resolveBundlePricing(bundle, products);

  return (
    <article className="grid h-full content-start rounded-lg border border-line bg-surface-raised p-5 text-ink shadow-soft">
      <div className="grid min-h-[5.5rem] gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
            {bundle.status === "active"
              ? "Available"
              : bundle.status === "sold_out"
                ? "Sold out"
                : "Draft"}
          </p>
          <h3 className="mt-2 text-xl font-semibold">{bundle.name}</h3>
        </div>
        {bundle.bundlePrice ? (
          <p className="w-fit rounded-pill bg-brand-lime/25 px-3 py-1 text-sm font-semibold text-ink sm:justify-self-end">
            <Price amount={bundle.bundlePrice.amount} />
          </p>
        ) : null}
      </div>
      <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-ink-muted">{bundle.description}</p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-ink">Suitable occasion</dt>
          <dd className="text-ink-muted">{bundle.occasion ?? "[OWNER_INPUT_REQUIRED]"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Lead time</dt>
          <dd className="text-ink-muted">{bundle.leadTime ?? "[OWNER_INPUT_REQUIRED]"}</dd>
        </div>
      </dl>
      <div className="mt-5">
        <IncludedItemsBreakdown bundle={bundle} products={products} />
      </div>
      {pricing.canDisplaySavings && pricing.savings ? (
        <p className="mt-4 text-sm font-semibold text-brand-green">
          Save <Price amount={pricing.savings.savings.amount} /> ({pricing.savings.savingsPercent}%)
        </p>
      ) : (
        <p className="mt-4 text-sm text-ink-muted">
          Savings are hidden until approved source product prices and bundle prices are available.
        </p>
      )}
      <TrackedBundleLink
        href={`/bundles/${bundle.slug}`}
        item={toBundleAnalyticsItem(bundle)}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-pill border border-brand-green px-4 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/10"
      >
        View bundle details
      </TrackedBundleLink>
    </article>
  );
}
