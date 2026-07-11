import type { Product } from "@/content/schemas";
import { ProductCard } from "@/features/catalog/ProductCard";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-surface-raised p-6 text-ink-muted">
        No cookie products are available yet. Owner-approved catalogue content is required.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
