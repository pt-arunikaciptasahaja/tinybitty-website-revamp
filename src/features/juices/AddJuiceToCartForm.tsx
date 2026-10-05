"use client";
import { useState } from "react";
import type { Juice } from "@/content/juices";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/features/catalog/QuantitySelector";
import { useCart } from "@/features/cart/CartProvider";
import { createJuiceCartItem } from "@/features/cart/cart-utils";
import { trackEvent } from "@/lib/analytics";
export function AddJuiceToCartForm({ juice }: { juice: Juice }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        addItem(createJuiceCartItem(juice, quantity));
        setAdded(true);
        trackEvent("add_to_cart", {
          source: "juice_enquiry",
          items: [
            {
              item_id: juice.id,
              item_name: juice.name,
              item_category: "juices",
              quantity,
              ...(juice.pricing.amount === null ? {} : { price: juice.pricing.amount }),
            },
          ],
        });
      }}
    >
      <QuantitySelector value={quantity} onChange={setQuantity} />
      <Button type="submit">Add to enquiry</Button>
      <p className="text-sm text-ink-muted">
        Availability, delivery, and payment are confirmed through WhatsApp.
      </p>
      <p role="status">{added ? "Added to enquiry." : ""}</p>
      {added ? (
        <Button href="/cart" variant="outline">
          Review enquiry
        </Button>
      ) : null}
    </form>
  );
}
