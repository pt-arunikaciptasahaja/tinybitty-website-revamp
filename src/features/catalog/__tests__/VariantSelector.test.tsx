import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProductVariant } from "@/content/schemas";
import { VariantSelector } from "@/features/catalog/VariantSelector";

const variants: ProductVariant[] = [
  {
    id: "active",
    label: "Active",
    price: { amount: 100, currency: "IDR" },
    status: "active",
  },
  {
    id: "sold-out",
    label: "Sold Out",
    price: { amount: 100, currency: "IDR" },
    status: "sold_out",
  },
  {
    id: "coming-soon",
    label: "Coming Soon",
    price: { amount: 100, currency: "IDR" },
    status: "coming_soon",
  },
];

describe("VariantSelector", () => {
  it("selects the first active variant and disables unavailable variants", () => {
    render(<VariantSelector variants={variants} />);

    expect(screen.getByRole("radio", { name: /Active/i })).toBeChecked();
    expect(screen.getByRole("radio", { name: /Sold Out/i })).toBeDisabled();
    expect(screen.getByRole("radio", { name: /Coming Soon/i })).toBeDisabled();
  });
});
