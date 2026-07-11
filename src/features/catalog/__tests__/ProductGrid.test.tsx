import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { products } from "@/content/products";
import { ProductGrid } from "@/features/catalog/ProductGrid";

describe("ProductGrid", () => {
  it("renders an empty state", () => {
    render(<ProductGrid products={[]} />);

    expect(screen.getByText(/No cookie products are available yet/i)).toBeInTheDocument();
  });

  it("renders product cards", () => {
    render(<ProductGrid products={products.filter((product) => product.category === "cookies")} />);

    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute(
      "href",
      "/cookies/placeholder-cookie-product",
    );
  });
});
