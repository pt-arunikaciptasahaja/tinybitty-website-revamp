"use client";

import { useMemo, useState } from "react";
import type { ProductVariant } from "@/content/schemas";

type VariantSelectorProps = {
  variants: ProductVariant[];
};

export function VariantSelector({ variants }: VariantSelectorProps) {
  const firstActiveVariant = useMemo(
    () => variants.find((variant) => variant.status === "active") ?? null,
    [variants],
  );
  const [selectedVariantId, setSelectedVariantId] = useState(firstActiveVariant?.id ?? "");

  return (
    <fieldset className="rounded-lg border border-line p-4">
      <legend className="px-1 text-sm font-semibold text-ink">Choose a variant</legend>
      <div className="mt-3 grid gap-2">
        {variants.map((variant) => {
          const isAvailable = variant.status === "active";

          return (
            <label
              key={variant.id}
              className="flex items-center justify-between gap-3 rounded-md border border-line p-3 text-sm"
            >
              <span>
                <span className="font-semibold text-ink">{variant.label}</span>
                {!isAvailable ? (
                  <span className="ml-2 text-xs font-semibold text-ink-muted">
                    {variant.status === "sold_out" ? "Sold out" : "Coming soon"}
                  </span>
                ) : null}
              </span>
              <input
                type="radio"
                name="variant"
                value={variant.id}
                checked={selectedVariantId === variant.id}
                disabled={!isAvailable}
                onChange={() => setSelectedVariantId(variant.id)}
              />
            </label>
          );
        })}
      </div>
      {!firstActiveVariant ? (
        <p className="mt-3 text-sm text-ink-muted">No variants are available for ordering yet.</p>
      ) : null}
    </fieldset>
  );
}
