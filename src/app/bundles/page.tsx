import type { Metadata } from "next";
import { bundles } from "@/content/bundles";
import { products } from "@/content/products";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BundleAnalytics } from "@/features/bundles/BundleAnalytics";
import { BundleGrid } from "@/features/bundles/BundleGrid";
import { toBundleAnalyticsItem } from "@/features/bundles/bundle-utils";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.bundles);

export default function BundlesPage() {
  return (
    <main>
      <BundleAnalytics
        source="bundles_catalogue"
        items={bundles.map((bundle) => toBundleAnalyticsItem(bundle))}
      />
      <Container className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="Bundles"
          title="Bundle catalogue"
          description="Savings are shown only when approved product prices and bundle prices are available and consistent."
        />
        <div className="mt-8">
          <BundleGrid bundles={bundles} products={products} />
        </div>
      </Container>
    </main>
  );
}
