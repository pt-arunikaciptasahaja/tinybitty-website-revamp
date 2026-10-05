"use client";

import { useState } from "react";

type QuantitySelectorProps = {
  disabled?: boolean;
  value?: number;
  onChange?: (quantity: number) => void;
};

export function QuantitySelector({ disabled = false, value, onChange }: QuantitySelectorProps) {
  const [localQuantity, setLocalQuantity] = useState(1);
  const quantity = value ?? localQuantity;
  function setQuantity(next: number) {
    setLocalQuantity(next);
    onChange?.(next);
  }

  return (
    <div className="rounded-lg border border-line p-4">
      <p className="text-sm font-semibold text-ink">Quantity</p>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-pill border border-line text-lg font-semibold disabled:opacity-40"
          disabled={disabled || quantity <= 1}
          aria-label="Decrease quantity"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
