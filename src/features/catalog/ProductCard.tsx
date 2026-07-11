import type { AnalyticsItem } from "@/lib/analytics";
import type { Product } from "@/content/schemas";
import { Price } from "@/components/ui/Price";
import { getActiveVariant, getProductAvailability } from "@/features/catalog/product-utils";
import { ProductImage } from "@/features/catalog/ProductImage";
import { TrackedProductLink } from "@/features/catalog/TrackedProductLink";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const activeVariant = getActiveVariant(product);
  const availability = getProductAvailability(product);
  const showSeasonalBadge = product.slug === "desert-crown-seasonal";
  const analyticsItem: AnalyticsItem = {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    ...(activeVariant
      ? { item_variant: activeVariant.label, price: activeVariant.price.amount }
      : {}),
  };

  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-surface-raised p-4 text-ink shadow-soft">
      <ProductImage
        product={product}
        className="rounded-md bg-[linear-gradient(135deg,rgb(var(--color-brand-pink)/0.35),rgb(var(--color-brand-lime)/0.3))]"
      />
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          {showSeasonalBadge ? (
            <span className="rounded-pill bg-surface-muted px-3 py-1 text-xs font-semibold text-ink-muted">
              Seasonal
            </span>
          ) : (
            <StatusBadge status={availability} />
          )}
        </div>
        <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">{product.shortDescription}</p>
        {activeVariant ? (
          <p className="mt-4 text-sm font-semibold text-brand-green">
            From <Price amount={activeVariant.price.amount} />
          </p>
        ) : (
          <p className="mt-4 text-sm font-semibold text-ink-muted">Price: [OWNER_INPUT_REQUIRED]</p>
        )}
        <TrackedProductLink
          href={`/cookies/${product.slug}`}
          item={analyticsItem}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-pill border border-brand-green px-4 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/10"
        >
          View details
        </TrackedProductLink>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: "active" | "sold_out" | "coming_soon" }) {
  const label = {
    active: "Available",
    sold_out: "Sold out",
    coming_soon: "Coming soon",
  }[status];

  return (
    <span className="rounded-pill bg-surface-muted px-3 py-1 text-xs font-semibold text-ink-muted">
      {label}
    </span>
  );
}
