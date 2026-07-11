"use client";

import { useState } from "react";

type QuantitySelectorProps = {
  disabled?: boolean;
};

export function QuantitySelector({ disabled = false }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="rounded-lg border border-line p-4">
      <p className="text-sm font-semibold text-ink">Quantity</p>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-pill border border-line text-lg font-semibold disabled:opacity-40"
          disabled={disabled || quantity <= 1}
          aria-label="Decrease quantity"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
        >
          -
        </button>
        <output
          aria-label="Selected quantity"
          className="min-w-8 text-center font-semibold text-ink"
        >
          {quantity}
        </output>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-pill border border-line text-lg font-semibold disabled:opacity-40"
          disabled={disabled}
          aria-label="Increase quantity"
          onClick={() => setQuantity((current) => current + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
