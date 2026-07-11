import type { Metadata } from "next";
import { products } from "@/content/products";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CatalogAnalytics } from "@/features/catalog/CatalogAnalytics";
import { ProductGrid } from "@/features/catalog/ProductGrid";
import {
  assertActiveProductsHaveActiveVariants,
  toAnalyticsItem,
} from "@/features/catalog/product-utils";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.cookies);

export default function CookiesPage() {
  const cookieProducts = products.filter((product) => product.category === "cookies");
  assertActiveProductsHaveActiveVariants(cookieProducts);

  return (
    <main>
      <CatalogAnalytics
        source="cookies_catalogue"
        items={cookieProducts.map((product) => toAnalyticsItem(product))}
      />
      <Container className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="Cookies"
          title="Cookie catalogue"
          description="Filters will be added only when the approved catalogue is large enough to justify them."
        />
        <div className="mt-8">
          <ProductGrid products={cookieProducts} />
        </div>
      </Container>
    </main>
  );
}
