import type { z } from "zod";
import {
  bundleSchema,
  corporatePackageSchema,
  faqSchema,
  productSchema,
  siteConfigSchema,
  testimonialSchema,
  type Bundle,
  type CorporatePackage,
  type FAQ,
  type Product,
  type SiteConfig,
  type Testimonial,
} from "@/content/schemas";

function parseRecords<T>(schema: z.ZodType<T>, records: readonly unknown[], label: string): T[] {
  return records.map((record, index) => {
    const result = schema.safeParse(record);

    if (!result.success) {
      throw new Error(`${label}[${index}] failed validation: ${result.error.message}`);
    }

    return result.data;
  });
}

function assertUnique(records: readonly { slug?: string; id: string }[], label: string): void {
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  records.forEach((record) => {
    if (seenIds.has(record.id)) {
      throw new Error(`Duplicate ${label} id: ${record.id}`);
    }

    seenIds.add(record.id);

    if (!record.slug) {
      return;
    }

    if (seenSlugs.has(record.slug)) {
      throw new Error(`Duplicate ${label} slug: ${record.slug}`);
    }

    seenSlugs.add(record.slug);
  });
}

export function validateProducts(records: readonly unknown[]): Product[] {
  const parsed = parseRecords(productSchema, records, "products");
  assertUnique(parsed, "product");
  return parsed;
}

export function validateBundles(records: readonly unknown[]): Bundle[] {
  const parsed = parseRecords(bundleSchema, records, "bundles");
  assertUnique(parsed, "bundle");
  return parsed;
}

export function validateTestimonials(records: readonly unknown[]): Testimonial[] {
  const parsed = parseRecords(testimonialSchema, records, "testimonials");
  assertUnique(parsed, "testimonial");
  return parsed;
}

export function validateFaqs(records: readonly unknown[]): FAQ[] {
  const parsed = parseRecords(faqSchema, records, "faqs");
  assertUnique(parsed, "faq");
  return parsed;
}

export function validateCorporatePackages(records: readonly unknown[]): CorporatePackage[] {
  const parsed = parseRecords(corporatePackageSchema, records, "corporatePackages");
  assertUnique(parsed, "corporate package");
  return parsed;
}

export function validateSiteConfig(record: unknown): SiteConfig {
  return siteConfigSchema.parse(record);
}
