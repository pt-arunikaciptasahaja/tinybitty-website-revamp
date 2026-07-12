"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/content/schemas";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { useCart } from "@/features/cart/CartProvider";
import { createProductCartItem } from "@/features/cart/cart-utils";
import { trackEvent } from "@/lib/analytics";

type AddProductToCartFormProps = {
  product: Product;
};

export function AddProductToCartForm({ product }: AddProductToCartFormProps) {
  const activeVariants = useMemo(
    () => product.variants.filter((variant) => variant.status === "active"),
    [product.variants],
  );
  const [selectedVariantId, setSelectedVariantId] = useState(activeVariants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [statusMessage, setStatusMessage] = useState("");
  const { addItem } = useCart();
  const selectedVariant =
    activeVariants.find((variant) => variant.id === selectedVariantId) ?? activeVariants[0] ?? null;
  const isAvailable = product.status === "active" && Boolean(selectedVariant);

  return (
    <form
      className="grid gap-4 rounded-lg border border-line p-4"
      onSubmit={(event) => {
        event.preventDefault();

        if (!selectedVariant || !isAvailable) {
          return;
        }

        addItem(createProductCartItem(product, selectedVariant, quantity));
        trackEvent("add_to_cart", {
          currency: "IDR",
          value: selectedVariant.price.amount * quantity,
          items: [
            {
              item_id: product.id,
              item_name: product.name,
              item_category: product.category,
              item_variant: selectedVariant.label,
              price: selectedVariant.price.amount,
              quantity,
            },
          ],
          source: "product_detail",
        });
        setStatusMessage("Added to cart.");
      }}
    >
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Choose a variant</legend>
        <div className="mt-3 grid gap-2">
          {product.variants.map((variant) => {
            const variantIsAvailable = product.status === "active" && variant.status === "active";

            return (
              <label
                key={variant.id}
                className="flex items-center justify-between gap-3 rounded-md border border-line p-3 text-sm"
              >
                <span>
                  <span className="font-semibold text-ink">{variant.label}</span>
                  <span className="ml-2 text-ink-muted">
                    <Price amount={variant.price.amount} />
                  </span>
                  {!variantIsAvailable ? (
                    <span className="ml-2 text-xs font-semibold text-ink-muted">
                      {variant.status === "sold_out" ? "Sold out" : "Coming soon"}
                    </span>
                  ) : null}
                </span>
                <input
                  type="radio"
                  name="cart-variant"
                  value={variant.id}
                  checked={selectedVariantId === variant.id}
                  disabled={!variantIsAvailable}
                  onChange={() => setSelectedVariantId(variant.id)}
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="grid gap-2 text-sm font-semibold text-ink">
        Quantity
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface text-ink transition-colors duration-base ease-smooth hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={!isAvailable || quantity <= 1}
          >
            -
          </button>
          <input
            className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-center text-base text-ink"
            type="number"
            min="1"
            inputMode="numeric"
            value={quantity}
            disabled={!isAvailable}
            onChange={(event) =>
              setQuantity(Math.max(1, Number.parseInt(event.target.value, 10) || 1))
            }
          />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface text-ink transition-colors duration-base ease-smooth hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setQuantity(quantity + 1)}
            disabled={!isAvailable}
          >
            +
          </button>
        </div>
      </label>

      <Button type="submit" disabled={!isAvailable}>
        Add to cart
      </Button>
      {!isAvailable ? (
        <p className="text-sm text-ink-muted">
          This product is not available for cart checkout yet.
        </p>
      ) : null}
      {statusMessage ? (
        <p className="text-sm font-semibold text-brand-green">{statusMessage}</p>
      ) : null}
    </form>
  );
}
