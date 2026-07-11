import type { Bundle, Product } from "@/content/schemas";
import { BundleCard } from "@/features/bundles/BundleCard";

type BundleGridProps = {
  bundles: Bundle[];
  products: Product[];
};

export function BundleGrid({ bundles, products }: BundleGridProps) {
  if (bundles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-surface-raised p-6 text-ink-muted">
        No bundles are available yet. Owner-approved bundle data is required.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {bundles.map((bundle) => (
        <BundleCard key={bundle.id} bundle={bundle} products={products} />
      ))}
    </div>
  );
}
