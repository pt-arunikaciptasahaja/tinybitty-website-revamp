import { describe, expect, it } from "vitest";
import { bundles } from "@/content/bundles";
import { corporatePackages } from "@/content/corporate-packages";
import { faqs } from "@/content/faqs";
import { products } from "@/content/products";
import { PLACEHOLDER_NOTICE, type Bundle, type Product } from "@/content/schemas";
import { siteConfig } from "@/content/site-config";
import { testimonials } from "@/content/testimonials";
import {
  validateBundles,
  validateCorporatePackages,
  validateFaqs,
  validateProducts,
  validateSiteConfig,
  validateTestimonials,
} from "@/content/validation";

describe("content validation", () => {
  it("accepts repository fixture records", () => {
    expect(validateProducts(products)).toHaveLength(products.length);
    expect(validateBundles(bundles)).toHaveLength(bundles.length);
    expect(validateTestimonials(testimonials)).toHaveLength(testimonials.length);
    expect(validateFaqs(faqs)).toHaveLength(faqs.length);
    expect(validateCorporatePackages(corporatePackages)).toHaveLength(corporatePackages.length);
    expect(validateSiteConfig(siteConfig).name).toBe("Tiny Bitty");
  });

  it("rejects duplicate product slugs", () => {
    const firstProduct = products[0];

    if (!firstProduct) {
      throw new Error("Expected scaffold product fixture to exist.");
    }

    expect(() =>
      validateProducts([
        firstProduct,
        {
          ...firstProduct,
          id: "duplicate-slug-product",
        },
      ]),
    ).toThrow("Duplicate product slug");
  });

  it("requires placeholder records to carry the non-production notice", () => {
    const firstProduct = products[0];

    if (!firstProduct) {
      throw new Error("Expected scaffold product fixture to exist.");
    }

    const invalidProduct: Product = {
      ...firstProduct,
      contentStatus: "placeholder",
      placeholderNotice: undefined,
    };

    expect(() => validateProducts([invalidProduct])).toThrow("non-production placeholder notice");
  });

  it("rejects invalid compare-at prices", () => {
    const firstProduct = products[0];

    if (!firstProduct) {
      throw new Error("Expected scaffold product fixture to exist.");
    }

    const invalidProduct: Product = {
      ...firstProduct,
      status: "active",
      contentStatus: "approved",
      placeholderNotice: undefined,
      variants: [
        {
          id: "bad-variant",
          label: "Bad Variant",
          price: { amount: 100, currency: "IDR" },
          compareAtPrice: { amount: 100, currency: "IDR" },
          status: "coming_soon",
        },
      ],
    };

    expect(() => validateProducts([invalidProduct])).toThrow("Compare-at price must exceed");
  });

  it("rejects bundle savings without a normal total price", () => {
    const invalidBundle: Bundle = {
      contentStatus: "placeholder",
      placeholderNotice: PLACEHOLDER_NOTICE,
      id: "invalid-bundle",
      slug: "invalid-bundle",
      name: "[OWNER_INPUT_REQUIRED]",
      description: "[OWNER_INPUT_REQUIRED]",
      includedItems: [],
      bundlePrice: { amount: 1, currency: "IDR" },
      status: "draft",
      seo: {
        title: "[OWNER_INPUT_REQUIRED]",
        description: "[OWNER_INPUT_REQUIRED]",
      },
    };

    expect(() => validateBundles([invalidBundle])).toThrow("normal total price");
  });

  it("rejects approved testimonials without removing placeholder metadata", () => {
    const invalidTestimonial = {
      contentStatus: "approved",
      placeholderNotice: PLACEHOLDER_NOTICE,
      id: "invalid-testimonial",
      quote: "Approved content must not carry placeholder metadata.",
      sourceLabel: "Approved source",
      hasPermission: true,
    };

    expect(() => validateTestimonials([invalidTestimonial])).toThrow(
      "Approved records must not include placeholder notices",
    );
  });
});
