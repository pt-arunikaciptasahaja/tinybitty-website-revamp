"use client";

import { useState } from "react";
import type { Bundle } from "@/content/schemas";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { useCart } from "@/features/cart/CartProvider";
import { createBundleCartItem } from "@/features/cart/cart-utils";
import { trackEvent } from "@/lib/analytics";

type AddBundleToCartFormProps = {
  bundle: Bundle;
};

export function AddBundleToCartForm({ bundle }: AddBundleToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [statusMessage, setStatusMessage] = useState("");
  const { addItem } = useCart();
  const isAvailable = bundle.status === "active" && Boolean(bundle.bundlePrice);

  return (
    <form
      className="mt-5 grid gap-4 rounded-lg border border-line bg-surface-muted p-4"
      onSubmit={(event) => {
        event.preventDefault();

        const cartItem = createBundleCartItem(bundle, quantity);

        if (!cartItem || !bundle.bundlePrice || !isAvailable) {
          return;
        }

        addItem(cartItem);
        trackEvent("add_to_cart", {
          currency: "IDR",
          value: bundle.bundlePrice.amount * quantity,
          items: [
            {
              item_id: bundle.id,
              item_name: bundle.name,
              item_category: "bundle",
              price: bundle.bundlePrice.amount,
              quantity,
            },
          ],
          source: "bundle_detail",
        });
        setStatusMessage("Added to cart.");
      }}
    >
      <div>
        <p className="font-semibold text-ink">Add bundle to cart</p>
        {bundle.bundlePrice ? (
          <p className="mt-1 text-sm text-ink-muted">
            Bundle price: <Price amount={bundle.bundlePrice.amount} />
          </p>
        ) : (
          <p className="mt-1 text-sm text-ink-muted">Bundle price: [OWNER_INPUT_REQUIRED]</p>
        )}
      </div>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Quantity
        <input
          className="min-h-11 rounded-md border border-line bg-surface px-3 text-base text-ink"
          type="number"
          min="1"
          inputMode="numeric"
          value={quantity}
          disabled={!isAvailable}
          onChange={(event) =>
            setQuantity(Math.max(1, Number.parseInt(event.target.value, 10) || 1))
          }
        />
      </label>
      <Button type="submit" disabled={!isAvailable}>
        Add bundle
      </Button>
      {!isAvailable ? (
        <p className="text-sm text-ink-muted">
          Bundle checkout unlocks after approved bundle price and availability are added.
        </p>
      ) : null}
      {statusMessage ? (
        <p className="text-sm font-semibold text-brand-green">{statusMessage}</p>
      ) : null}
    </form>
  );
}
