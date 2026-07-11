import type { Product } from "@/content/schemas";
import { JsonLd } from "@/features/seo/JsonLd";
import { getActiveVariant } from "@/features/catalog/product-utils";
import { buildAbsoluteUrl, hasApprovedProductStructuredData } from "@/lib/seo";

type ProductJsonLdProps = {
  product: Product;
};

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  if (!hasApprovedProductStructuredData(product)) {
    return null;
  }

  const image = product.images[0];
  const activeVariant = getActiveVariant(product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: image ? [buildAbsoluteUrl(image.src)] : undefined,
    sku: product.id,
    category: product.category,
    offers: activeVariant
      ? {
          "@type": "Offer",
          priceCurrency: activeVariant.price.currency,
          price: activeVariant.price.amount,
          availability: "https://schema.org/InStock",
          url: buildAbsoluteUrl(`/cookies/${product.slug}`),
        }
      : undefined,
  };

  return <JsonLd data={jsonLd} />;
}
