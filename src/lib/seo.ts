import type { Metadata } from "next";
import { OWNER_INPUT_REQUIRED, type FAQ, type Product } from "@/content/schemas";
import { siteConfig } from "@/content/site-config";

export const SEO_IMAGE_PATH = "/opengraph-image";

export type RouteSeo = {
  path: string;
  title: string;
  description: string;
};

export const routeSeo = {
  home: {
    path: "/",
    title: "Tiny Bitty",
    description:
      "Tiny Bitty is a cookie catalogue for individual orders, bundles, and corporate gifts.",
  },
  cookies: {
    path: "/cookies",
    title: "Cookies",
    description: "Browse Tiny Bitty cookie products and prepare a WhatsApp enquiry.",
  },
  bundles: {
    path: "/bundles",
    title: "Bundles",
    description: "Browse Tiny Bitty bundle options and prepare a WhatsApp enquiry.",
  },
  corporateGifts: {
    path: "/corporate-gifts",
    title: "Corporate Gifts",
    description:
      "Request a Tiny Bitty corporate gifting quotation for package tiers and customization.",
  },
  cart: {
    path: "/cart",
    title: "Cart",
    description: "Review your Tiny Bitty cart and prepare a structured WhatsApp enquiry.",
  },
  about: {
    path: "/about",
    title: "Our Story",
    description: "Learn where Tiny Bitty owner-approved story and production details will appear.",
  },
  reviews: {
    path: "/reviews",
    title: "Reviews",
    description:
      "Read Tiny Bitty reviews after verified permissions and source labels are approved.",
  },
  delivery: {
    path: "/delivery",
    title: "Delivery",
    description: "Review Tiny Bitty delivery, pickup, fee, and schedule confirmation information.",
  },
  faq: {
    path: "/faq",
    title: "FAQ",
    description:
      "Find answers about Tiny Bitty ordering, delivery, products, corporate gifts, and policies.",
  },
  contact: {
    path: "/contact",
    title: "Contact",
    description:
      "Contact Tiny Bitty for order, delivery, product, and corporate gifting enquiries.",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy",
    description: "Review how Tiny Bitty will document privacy and enquiry data handling.",
  },
  terms: {
    path: "/terms",
    title: "Terms",
    description:
      "Review Tiny Bitty terms for ordering, fulfilment, delivery, and payment confirmation.",
  },
} satisfies Record<string, RouteSeo>;

export const staticRouteSeo = Object.values(routeSeo);

export function buildMetadata(route: RouteSeo): Metadata {
  return {
    title: route.title,
    description: route.description,
    alternates: {
      canonical: route.path,
    },
    openGraph: {
      title: route.title,
      description: route.description,
      url: route.path,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: SEO_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} catalogue preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: [SEO_IMAGE_PATH],
    },
  };
}

export function buildAbsoluteUrl(path: string): string {
  return new URL(path, siteConfig.siteUrl).toString();
}

export function isApprovedText(value: string | undefined): value is string {
  if (!value) {
    return false;
  }

  const lowered = value.toLowerCase();
  return !value.includes(OWNER_INPUT_REQUIRED) && !lowered.includes("placeholder");
}

export function hasApprovedProductStructuredData(product: Product): boolean {
  return (
    product.contentStatus === "approved" &&
    isApprovedText(product.name) &&
    isApprovedText(product.description) &&
    product.images.every((image) => isApprovedText(image.alt)) &&
    product.variants.some((variant) => variant.status === "active")
  );
}

export function faqQualifiesForStructuredData(faq: FAQ): boolean {
  return (
    faq.contentStatus === "approved" &&
    isApprovedText(faq.question) &&
    isApprovedText(faq.answer) &&
    faq.question.endsWith("?")
  );
}

export function assertProductionMetadata(metadata: readonly RouteSeo[]): void {
  metadata.forEach((route) => {
    if (!isApprovedText(route.title) || !isApprovedText(route.description)) {
      throw new Error(`Route ${route.path} has invalid production SEO metadata.`);
    }
  });
}
