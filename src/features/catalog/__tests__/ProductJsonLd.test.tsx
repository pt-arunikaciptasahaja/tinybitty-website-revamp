import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Product } from "@/content/schemas";
import { ProductJsonLd } from "@/features/catalog/ProductJsonLd";

describe("ProductJsonLd", () => {
  it("does not render placeholder product structured data", () => {
    const product = makePlaceholderProduct();
    const { container } = render(<ProductJsonLd product={product} />);

    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it("renders approved product structured data without aggregate ratings", () => {
    const product = makeApprovedProduct();
    const { container } = render(<ProductJsonLd product={product} />);

    const script = container.querySelector('script[type="application/ld+json"]');

    if (!script) {
      throw new Error("Expected product JSON-LD script to render.");
    }

    const jsonLd = JSON.parse(script.textContent ?? "{}") as Record<string, unknown>;

    expect(jsonLd["@type"]).toBe("Product");
    expect(jsonLd).not.toHaveProperty("aggregateRating");
  });
});

function makePlaceholderProduct(): Product {
  return {
    contentStatus: "placeholder",
    placeholderNotice: "NON_PRODUCTION_PLACEHOLDER_REPLACE_WITH_OWNER_APPROVED_CONTENT",
    id: "placeholder-cookie",
    slug: "placeholder-cookie",
    category: "cookies",
    status: "coming_soon",
    name: "[OWNER_INPUT_REQUIRED]",
    shortDescription: "[OWNER_INPUT_REQUIRED]",
    description: "[OWNER_INPUT_REQUIRED]",
    images: [
      {
        src: "/images/placeholders/product-cookie.svg",
        alt: "Placeholder cookie product",
        width: 1200,
        height: 900,
      },
    ],
    ingredients: ["[OWNER_INPUT_REQUIRED]"],
    allergens: ["[OWNER_INPUT_REQUIRED]"],
    featured: false,
    variants: [
      {
        id: "placeholder-box",
        label: "[OWNER_INPUT_REQUIRED]",
        price: { amount: 0, currency: "IDR" },
        status: "coming_soon",
      },
    ],
    seo: {
      title: "[OWNER_INPUT_REQUIRED]",
      description: "[OWNER_INPUT_REQUIRED]",
    },
  };
}

function makeApprovedProduct(): Product {
  return {
    contentStatus: "approved",
    id: "approved-cookie",
    slug: "approved-cookie",
    category: "cookies",
    status: "active",
    name: "Approved Cookie",
    shortDescription: "Approved short description.",
    description: "Approved product description.",
    images: [
      {
        src: "/images/approved-cookie.jpg",
        alt: "Approved cookie product photo",
        width: 1200,
        height: 900,
      },
    ],
    ingredients: ["Approved ingredient"],
    allergens: ["Approved allergen statement"],
    featured: false,
    variants: [
      {
        id: "box",
        label: "Box",
        price: { amount: 25000, currency: "IDR" },
        status: "active",
      },
    ],
    seo: {
      title: "Approved Cookie",
      description: "Approved cookie metadata.",
    },
  };
}
