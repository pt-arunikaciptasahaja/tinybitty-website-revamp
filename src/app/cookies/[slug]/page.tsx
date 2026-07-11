import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/content/products";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/features/catalog/Breadcrumbs";
import { ProductCard } from "@/features/catalog/ProductCard";
import { ProductImage } from "@/features/catalog/ProductImage";
import { ProductJsonLd } from "@/features/catalog/ProductJsonLd";
import { ProductViewAnalytics } from "@/features/catalog/ProductViewAnalytics";
import { AddProductToCartForm } from "@/features/cart/AddProductToCartForm";
import { BreadcrumbJsonLd } from "@/features/seo/BreadcrumbJsonLd";
import {
  getActiveVariant,
  getProductAvailability,
  getProductBySlug,
  getRelatedProducts,
  toAnalyticsItem,
} from "@/features/catalog/product-utils";
import { buildMetadata, isApprovedText, routeSeo } from "@/lib/seo";

type CookieDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): Array<{ slug: string }> {
  return products
    .filter((product) => product.category === "cookies")
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: CookieDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(products, slug);

  if (!product || product.category !== "cookies") {
    return buildMetadata({
      path: `/cookies/${slug}`,
      title: "Cookie not found",
      description: "The requested Tiny Bitty cookie product was not found.",
    });
  }

  return buildMetadata({
    path: `/cookies/${product.slug}`,
    title: isApprovedText(product.seo.title) ? product.seo.title : "Cookie Product Details",
    description: isApprovedText(product.seo.description)
      ? product.seo.description
      : "Review Tiny Bitty cookie product details and prepare a WhatsApp enquiry.",
  });
}

export default async function CookieDetailPage({ params }: CookieDetailPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(products, slug);

  if (!product || product.category !== "cookies") {
    notFound();
  }

  const availability = getProductAvailability(product);
  const activeVariant = getActiveVariant(product);
  const relatedProducts = getRelatedProducts(products, product);
  const seoProductLabel = isApprovedText(product.name) ? product.name : "Cookie Product Details";

  return (
    <main>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { href: routeSeo.cookies.path, label: routeSeo.cookies.title },
          { href: `/cookies/${product.slug}`, label: seoProductLabel },
        ]}
      />
      <ProductViewAnalytics item={toAnalyticsItem(product)} />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { href: "/cookies", label: "Cookies" },
            { href: `/cookies/${product.slug}`, label: product.name },
          ]}
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <ProductImage
            product={product}
            className="rounded-lg bg-[linear-gradient(135deg,rgb(var(--color-brand-pink)/0.35),rgb(var(--color-brand-lime)/0.3))]"
          />
          <section aria-labelledby="product-title">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
              {product.slug === "desert-crown-seasonal"
                ? "Seasonal"
                : availability === "active"
                  ? "Available"
                  : availability === "sold_out"
                    ? "Sold out"
                    : "Coming soon"}
            </p>
            <h1
              id="product-title"
              className="mt-3 text-3xl font-bold tracking-normal text-ink sm:text-4xl"
            >
              {product.name}
            </h1>
            <p className="mt-4 text-base leading-7 text-ink-muted">{product.description}</p>
            {activeVariant ? (
              <p className="mt-5 text-lg font-semibold text-brand-green">
                From <Price amount={activeVariant.price.amount} />
              </p>
            ) : (
              <p className="mt-5 text-base font-semibold text-ink-muted">
                Price: [OWNER_INPUT_REQUIRED]
              </p>
            )}
            <div className="mt-6 grid gap-4">
              <AddProductToCartForm product={product} />
              <p className="rounded-lg border border-line bg-surface-muted p-4 text-sm leading-6 text-ink-muted">
                Stock, delivery fee, schedule, and payment require WhatsApp confirmation before the
                order is final.
              </p>
            </div>
          </section>
        </div>

        <section className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <ProductFacts
            title="Product information"
            items={[
              { label: "Overview", value: product.shortDescription ?? "" },
              { label: "Texture", value: product.texture ?? "" },
              { label: "Shelf life", value: product.shelfLife ?? "" },
              { label: "Storage", value: product.storage ?? "" },
            ]}
          />
          <div className="grid gap-5">
            <ProductFacts title="Ingredients" values={product.ingredients} />
            <ProductFacts title="Allergens" values={product.allergens} />
          </div>
        </section>

        <section className="mt-12">
          <SectionHeader
            eyebrow="Related products"
            title="More cookies"
            description="Related products use the same approved category content when available."
          />
          {relatedProducts.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-line bg-surface-raised p-5 text-ink-muted">
              Related products require more approved cookie records.
            </p>
          )}
        </section>

        <div className="mt-10">
          <Link href="/cookies" className="text-sm font-semibold text-brand-green underline">
            Back to cookies
          </Link>
        </div>
      </Container>
    </main>
  );
}

function ProductFacts({
  title,
  items,
  values,
}: {
  title: string;
  items?: Array<{ label: string; value: string }>;
  values?: Array<string | undefined>;
}) {
  const visibleItems = items?.filter((item) => Boolean(item.value)) ?? [];
  const visibleValues = values?.filter((value): value is string => Boolean(value)) ?? [];

  return (
    <section className="rounded-xl border border-line/80 bg-surface-raised p-4 shadow-soft sm:p-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-muted">{title}</h2>
      {visibleItems.length > 0 ? (
        <dl className="mt-4 space-y-3">
          {visibleItems.map((item) => (
            <div key={`${title}-${item.label}`} className="border-b border-line/70 pb-3 last:border-b-0 last:pb-0">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm leading-7 text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : visibleValues.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-ink-muted">
          {visibleValues.map((value) => (
            <li key={value} className="leading-7 text-ink">
              {value}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-7 text-ink-muted">Details will be shared once approved.</p>
      )}
    </section>
  );
}
