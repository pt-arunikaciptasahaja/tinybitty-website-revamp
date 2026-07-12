import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { bundles } from "@/content/bundles";
import { products } from "@/content/products";
import { BundleCard } from "@/features/bundles/BundleCard";
import { BundleGrid } from "@/features/bundles/BundleGrid";

describe("BundleCard", () => {
  it("renders approved bundle content and bundle savings", () => {
    const bundle = bundles[0];

    if (!bundle) {
      throw new Error("Expected bundle fixture to exist.");
    }

    render(<BundleCard bundle={bundle} products={products} />);

    expect(screen.getByRole("heading", { name: "Sweet Sharing Mini Bundle" })).toBeInTheDocument();
    expect(screen.getByText(/Rp55.000/)).toBeInTheDocument();
    expect(screen.getByText(/Save/)).toHaveTextContent("Save Rp5.000 (8%)");
    expect(screen.getAllByText(/Golden Crunch/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Heavenly Bites/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Harvest Haven/i).length).toBeGreaterThan(0);
  });

  it("renders an empty grid state", () => {
    render(<BundleGrid bundles={[]} products={products} />);

    expect(screen.getByText(/No bundles are available yet/i)).toBeInTheDocument();
  });
});
