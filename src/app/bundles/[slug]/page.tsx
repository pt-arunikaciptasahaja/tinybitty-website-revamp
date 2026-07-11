import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bundles } from "@/content/bundles";
import { products } from "@/content/products";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/features/catalog/Breadcrumbs";
import { AddBundleToCartForm } from "@/features/cart/AddBundleToCartForm";
import { IncludedItemsBreakdown } from "@/features/bundles/IncludedItemsBreakdown";
import { BundleAnalytics } from "@/features/bundles/BundleAnalytics";
import { BreadcrumbJsonLd } from "@/features/seo/BreadcrumbJsonLd";
import {
  getBundleBySlug,
  resolveBundlePricing,
  toBundleAnalyticsItem,
} from "@/features/bundles/bundle-utils";
import { buildMetadata, isApprovedText, routeSeo } from "@/lib/seo";

type BundleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): Array<{ slug: string }> {
  return bundles.map((bundle) => ({ slug: bundle.slug }));
}

export async function generateMetadata({ params }: BundleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = getBundleBySlug(bundles, slug);

  if (!bundle) {
    return buildMetadata({
      path: `/bundles/${slug}`,
      title: "Bundle not found",
      description: "The requested Tiny Bitty bundle was not found.",
    });
  }

  return buildMetadata({
    path: `/bundles/${bundle.slug}`,
    title: isApprovedText(bundle.seo.title) ? bundle.seo.title : "Bundle Details",
    description: isApprovedText(bundle.seo.description)
      ? bundle.seo.description
      : "Review Tiny Bitty bundle details and prepare a WhatsApp enquiry.",
  });
}

export default async function BundleDetailPage({ params }: BundleDetailPageProps) {
  const { slug } = await params;
  const bundle = getBundleBySlug(bundles, slug);

  if (!bundle) {
    notFound();
  }

  const pricing = resolveBundlePricing(bundle, products);
  const seoBundleLabel = isApprovedText(bundle.name) ? bundle.name : "Bundle Details";

  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { href: routeSeo.bundles.path, label: routeSeo.bundles.title },
          { href: `/bundles/${bundle.slug}`, label: seoBundleLabel },
        ]}
      />
      <BundleAnalytics
        eventName="view_item"
        source="bundle_detail"
        items={[toBundleAnalyticsItem(bundle)]}
      />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { href: "/bundles", label: "Bundles" },
            { href: `/bundles/${bundle.slug}`, label: bundle.name },
          ]}
        />
        <section className="mt-8 rounded-lg border border-line bg-surface-raised p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
            {bundle.status === "active"
              ? "Available"
              : bundle.status === "sold_out"
                ? "Sold out"
                : "Draft"}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-normal text-ink sm:text-4xl">
            {bundle.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">{bundle.description}</p>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-ink">Suitable occasion</dt>
              <dd className="text-ink-muted">{bundle.occasion ?? "[OWNER_INPUT_REQUIRED]"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Customization</dt>
              <dd className="text-ink-muted">{bundle.customization ?? "[OWNER_INPUT_REQUIRED]"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Lead time</dt>
              <dd className="text-ink-muted">{bundle.leadTime ?? "[OWNER_INPUT_REQUIRED]"}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <SectionHeader
              title="Included items"
              description="Approved product and variant data is required for final bundle composition."
            />
            <div className="mt-5">
              <IncludedItemsBreakdown bundle={bundle} products={products} />
            </div>
          </div>
          <aside className="rounded-lg border border-line bg-surface-raised p-5">
            <h2 className="font-semibold text-ink">Bundle pricing</h2>
            {pricing.sourceNormalPrice ? (
              <p className="mt-3 text-sm text-ink-muted">
                Normal total: <Price amount={pricing.sourceNormalPrice.amount} />
              </p>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">Normal total: [OWNER_INPUT_REQUIRED]</p>
            )}
            {bundle.bundlePrice ? (
              <p className="mt-2 text-sm font-semibold text-brand-green">
                Bundle price: <Price amount={bundle.bundlePrice.amount} />
              </p>
            ) : (
              <p className="mt-2 text-sm text-ink-muted">Bundle price: [OWNER_INPUT_REQUIRED]</p>
            )}
            {pricing.canDisplaySavings && pricing.savings ? (
              <p className="mt-4 rounded-md bg-brand-lime/25 p-3 text-sm font-semibold text-ink">
                Save <Price amount={pricing.savings.savings.amount} /> (
                {pricing.savings.savingsPercent}%)
              </p>
            ) : (
              <p className="mt-4 text-sm text-ink-muted">
                Savings are hidden until source prices are approved and consistent.
              </p>
            )}
            <AddBundleToCartForm bundle={bundle} />
          </aside>
        </section>

        <div className="mt-10">
          <Link href="/bundles" className="text-sm font-semibold text-brand-green underline">
            Back to bundles
          </Link>
        </div>
      </Container>
    </main>
  );
}
