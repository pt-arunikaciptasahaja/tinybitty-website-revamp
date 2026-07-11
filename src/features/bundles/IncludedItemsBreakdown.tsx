import type { Bundle, Product } from "@/content/schemas";
import { Price } from "@/components/ui/Price";

type IncludedItemsBreakdownProps = {
  bundle: Bundle;
  products: Product[];
};

export function IncludedItemsBreakdown({ bundle, products }: IncludedItemsBreakdownProps) {
  if (bundle.includedItems.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-line bg-surface-muted p-4 text-sm text-ink-muted">
        Included products: [OWNER_INPUT_REQUIRED]
      </p>
    );
  }

  return (
    <ul className="grid gap-3">
      {bundle.includedItems.map((item) => {
        const product = products.find((record) => record.id === item.productId);
        const variant = product?.variants.find((record) => record.id === item.variantId);

        return (
          <li
            key={`${item.productId}-${item.variantId}`}
            className="rounded-md border border-line bg-surface-muted p-4 text-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">
                  {product?.name ?? "[OWNER_INPUT_REQUIRED]"}
                </p>
                <p className="text-ink-muted">
                  {variant?.label ?? "[OWNER_INPUT_REQUIRED]"} × {item.quantity}
                </p>
              </div>
              {variant ? (
                <p className="font-semibold text-brand-green">
                  <Price amount={variant.price.amount * item.quantity} />
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
