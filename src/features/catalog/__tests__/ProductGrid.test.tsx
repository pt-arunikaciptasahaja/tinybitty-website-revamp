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

    expect(screen.getAllByRole("link", { name: "View details" })).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Golden Crunch" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Golden Crunch cookie with almonds and chocolate chips" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "View details" })[0]).toHaveAttribute(
      "href",
      "/cookies/golden-crunch",
    );
  });
});
