import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { bundles } from "@/content/bundles";
import { products } from "@/content/products";
import { BundleCard } from "@/features/bundles/BundleCard";
import { BundleGrid } from "@/features/bundles/BundleGrid";

describe("BundleCard", () => {
  it("renders bundle content and hides savings when prices are missing", () => {
    const bundle = bundles[0];

    if (!bundle) {
      throw new Error("Expected bundle fixture to exist.");
    }

    render(<BundleCard bundle={bundle} products={products} />);

    expect(screen.getByRole("heading", { name: "[OWNER_INPUT_REQUIRED]" })).toBeInTheDocument();
    expect(screen.getByText(/Savings are hidden/i)).toBeInTheDocument();
    expect(screen.getByText("Included products: [OWNER_INPUT_REQUIRED]")).toBeInTheDocument();
  });

  it("renders an empty grid state", () => {
    render(<BundleGrid bundles={[]} products={products} />);

    expect(screen.getByText(/No bundles are available yet/i)).toBeInTheDocument();
  });
});
