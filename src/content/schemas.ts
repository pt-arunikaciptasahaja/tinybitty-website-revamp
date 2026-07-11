import { z } from "zod";

export const OWNER_INPUT_REQUIRED = "[OWNER_INPUT_REQUIRED]" as const;
export const PLACEHOLDER_NOTICE =
  "NON_PRODUCTION_PLACEHOLDER_REPLACE_WITH_OWNER_APPROVED_CONTENT" as const;

export const contentStatusSchema = z.enum(["placeholder", "approved"]);
export const productCategorySchema = z.enum(["cookies"]);
export const productStatusSchema = z.enum(["active", "sold_out", "coming_soon"]);
export const bundleStatusSchema = z.enum(["draft", "active", "sold_out"]);
export const corporatePackageStatusSchema = z.enum(["draft", "active"]);

export const moneySchema = z.object({
  amount: z.number().int().nonnegative(),
  currency: z.literal("IDR"),
});

export const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const placeholderFieldsSchema = z
  .object({
    contentStatus: contentStatusSchema,
    placeholderNotice: z.literal(PLACEHOLDER_NOTICE).optional(),
  })
  .superRefine((record, context) => {
    if (record.contentStatus === "placeholder" && record.placeholderNotice !== PLACEHOLDER_NOTICE) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["placeholderNotice"],
        message: "Placeholder records must include the non-production placeholder notice.",
      });
    }

    if (record.contentStatus === "approved" && record.placeholderNotice) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["placeholderNotice"],
        message: "Approved records must not include placeholder notices.",
      });
    }
  });

export const productVariantSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    sku: z.string().optional(),
    weightGrams: z.number().int().positive().optional(),
    price: moneySchema,
    compareAtPrice: moneySchema.optional(),
    sweetnessOptions: z.array(z.string().min(1)).optional(),
    status: productStatusSchema,
  })
  .superRefine((variant, context) => {
    if (variant.compareAtPrice && variant.compareAtPrice.amount <= variant.price.amount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["compareAtPrice"],
        message: "Compare-at price must exceed current price.",
      });
    }
  });

export const productSchema = placeholderFieldsSchema
  .and(
    z.object({
      id: z.string().min(1),
      slug: z.string().min(1),
      category: productCategorySchema,
      status: productStatusSchema,
      name: z.string().min(1),
      shortDescription: z.string().min(1),
      description: z.string().min(1),
      images: z.array(imageSchema).min(1),
      flavorNotes: z.array(z.string().min(1)).optional(),
      texture: z.string().optional(),
      ingredients: z.array(z.string().min(1)),
      allergens: z.array(z.string().min(1)),
      shelfLife: z.string().optional(),
      storage: z.string().optional(),
      deliveryNotes: z.string().optional(),
      featured: z.boolean(),
      variants: z.array(productVariantSchema).min(1),
      seo: seoSchema,
    }),
  )
  .superRefine((product, context) => {
    if (
      product.contentStatus === "approved" &&
      product.status === "active" &&
      !product.variants.some((variant) => variant.status === "active")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants"],
        message: "Approved products must have at least one active variant.",
      });
    }
  });

export const bundleItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const bundleSchema = placeholderFieldsSchema
  .and(
    z.object({
      id: z.string().min(1),
      slug: z.string().min(1),
      name: z.string().min(1),
      description: z.string().min(1),
      includedItems: z.array(bundleItemSchema),
      normalPrice: moneySchema.optional(),
      bundlePrice: moneySchema.optional(),
      occasion: z.string().optional(),
      customization: z.string().optional(),
      leadTime: z.string().optional(),
      status: bundleStatusSchema,
      seo: seoSchema,
    }),
  )
  .superRefine((bundle, context) => {
    if (bundle.bundlePrice && !bundle.normalPrice) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["normalPrice"],
        message: "Bundle price cannot be published without a normal total price.",
      });
    }

    if (
      bundle.normalPrice &&
      bundle.bundlePrice &&
      bundle.bundlePrice.amount > bundle.normalPrice.amount
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bundlePrice"],
        message: "Bundle price must not exceed normal total price.",
      });
    }

    if (bundle.contentStatus === "approved" && bundle.includedItems.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["includedItems"],
        message: "Approved bundles must list included items.",
      });
    }
  });

export const testimonialSchema = placeholderFieldsSchema.and(
  z.object({
    id: z.string().min(1),
    quote: z.string().min(1),
    sourceLabel: z.string().min(1),
    purchaseContext: z.string().optional(),
    hasPermission: z.boolean(),
  }),
);

export const faqSchema = placeholderFieldsSchema.and(
  z.object({
    id: z.string().min(1),
    question: z.string().min(1),
    answer: z.string().min(1),
    category: z.enum(["ordering", "delivery", "products", "corporate", "legal"]),
  }),
);

export const corporatePackageSchema = placeholderFieldsSchema
  .and(
    z.object({
      id: z.string().min(1),
      slug: z.string().min(1),
      name: z.string().min(1),
      description: z.string().min(1),
      startingPrice: moneySchema.optional(),
      includedItems: z.array(z.string().min(1)),
      minimumOrderQuantity: z.number().int().positive().optional(),
      leadTime: z.string().optional(),
      customizationOptions: z.array(z.string().min(1)),
      status: corporatePackageStatusSchema,
    }),
  )
  .superRefine((record, context) => {
    if (record.contentStatus === "approved" && record.includedItems.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["includedItems"],
        message: "Approved corporate packages must list included items.",
      });
    }
  });

export const navItemSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
});

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  siteUrl: z.string().url(),
  description: z.string().min(1),
  announcement: z.object({
    enabled: z.boolean(),
    text: z.string().min(1),
    href: z.string().min(1),
    linkLabel: z.string().min(1),
  }),
  footerNote: z.string().min(1),
  whatsappNumber: z.string().min(1),
  instagramUrl: z.string().url(),
  logo: z.object({
    label: z.string().min(1),
    imageSrc: z.string(),
  }),
  navigation: z.array(navItemSchema).min(1),
  footerNavigation: z.array(navItemSchema).min(1),
  stickyCta: navItemSchema,
});

export type Money = z.infer<typeof moneySchema>;
export type ProductCategory = z.infer<typeof productCategorySchema>;
export type ProductStatus = z.infer<typeof productStatusSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type Product = z.infer<typeof productSchema>;
export type Bundle = z.infer<typeof bundleSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type FAQ = z.infer<typeof faqSchema>;
export type CorporatePackage = z.infer<typeof corporatePackageSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;
