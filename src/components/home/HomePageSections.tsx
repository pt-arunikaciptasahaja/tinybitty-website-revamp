import Link from "next/link";
import { bundles } from "@/content/bundles";
import { corporatePackages } from "@/content/corporate-packages";
import { faqs } from "@/content/faqs";
import { products } from "@/content/products";
import { OWNER_INPUT_REQUIRED } from "@/content/schemas";
import { siteConfig } from "@/content/site-config";
import { testimonials } from "@/content/testimonials";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrackedLink } from "@/components/home/TrackedLink";

const socialPlaceholders = [
  {
    title: "Customer photo",
    label: OWNER_INPUT_REQUIRED,
  },
  {
    title: "Behind the scenes",
    label: OWNER_INPUT_REQUIRED,
  },
  {
    title: "Gift packaging",
    label: OWNER_INPUT_REQUIRED,
  },
];

const heroHighlight = "Freshly baked cookies for sharing, gifting, and corporate occasions.";

const orderingSteps = [
  {
    title: "Select products",
    body: "Browse the catalogue and choose the items you want to ask about.",
  },
  {
    title: "Share delivery details",
    body: "Provide area, preferred date, and notes when the checkout flow is added.",
  },
  {
    title: "Continue to WhatsApp",
    body: "Tiny Bitty confirms stock, delivery fee, payment total, and schedule in WhatsApp.",
  },
];

export function HomePageSections() {
  const bestSellers = products.filter((product) => product.category === "cookies").slice(0, 4);
  const firstBundle = bundles[0];
  const firstCorporatePackage = corporatePackages[0];
  const visibleFaqs = faqs.slice(0, 4);

  return (
    <main>
      <section className="bg-brand-pink/20">
        <Container className="grid min-h-[calc(100svh-8rem)] content-center gap-8 py-10 sm:py-16">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-green">
              {heroHighlight}
            </p>
            <h1 className="text-4xl font-bold tracking-normal text-brand-green sm:text-6xl">
              {siteConfig.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-brand-green/85">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[360px]:flex-row min-[360px]:flex-wrap">
              <TrackedLink
                href="/cookies"
                eventName="select_item"
                payload={{ source: "homepage_hero_primary" }}
                size="lg"
              >
                Shop Best Sellers
              </TrackedLink>
              <TrackedLink
                href="/corporate-gifts"
                eventName="corporate_enquiry"
                payload={{ source: "homepage_hero_secondary" }}
                size="lg"
                variant="outline"
              >
                Corporate Orders
              </TrackedLink>
            </div>
          </div>
        </Container>
      </section>

      <Container as="section" className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="Best sellers"
          title="Cookie catalogue"
          description="Owner-approved products will appear here with names, prices, images, variants, allergens, and availability."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => {
            const variant = product.variants[0];
            const analyticsItem = {
              item_id: product.id,
              item_name: product.name,
              item_category: product.category,
              ...(variant ? { price: variant.price.amount } : {}),
            };

            return (
              <article
                key={product.id}
                className="rounded-lg border border-line bg-surface-raised p-4 text-ink shadow-soft"
              >
                <div
                  role="img"
                  aria-label={product.images[0]?.alt ?? OWNER_INPUT_REQUIRED}
                  className="aspect-[4/3] rounded-md bg-[linear-gradient(135deg,rgb(var(--color-brand-pink)/0.35),rgb(var(--color-brand-lime)/0.3))]"
                />
                <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{product.shortDescription}</p>
                {variant ? (
                  <p className="mt-3 text-sm font-semibold text-brand-green">
                    {variant.label}: <Price amount={variant.price.amount} />
                  </p>
                ) : null}
                <TrackedLink
                  href={`/cookies/${product.slug}`}
                  eventName="select_item"
                  payload={{
                    source: "homepage_best_sellers",
                    items: [analyticsItem],
                  }}
                  variant="ghost"
                  className="mt-4 w-full"
                >
                  View details
                </TrackedLink>
              </article>
            );
          })}
        </div>
      </Container>

      <section className="bg-surface-muted">
        <Container className="grid gap-6 py-12 sm:py-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <SectionHeader
            eyebrow="Sweetness options"
            title="Differentiator copy needs owner approval"
            description="Use this section to explain sweetness choices, texture, shelf life, and storage once the owner has approved exact wording."
          />
          <div className="grid gap-3 rounded-lg border border-line bg-surface-raised p-4">
            <div className="rounded-md bg-brand-pink/25 p-4">
              <h3 className="font-semibold text-ink">Normal sweetness</h3>
              <p className="mt-2 text-sm text-ink-muted">{OWNER_INPUT_REQUIRED}</p>
            </div>
            <div className="rounded-md bg-brand-lime/25 p-4">
              <h3 className="font-semibold text-ink">Less sugar option</h3>
              <p className="mt-2 text-sm text-ink-muted">{OWNER_INPUT_REQUIRED}</p>
            </div>
          </div>
        </Container>
      </section>

      <Container as="section" className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="Bundles"
          title="Bundle offers"
          description="Bundle savings are not shown until approved normal prices and bundle prices are available."
        />
        <div className="mt-6 rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
          <h3 className="text-xl font-semibold text-ink">
            {firstBundle?.name ?? OWNER_INPUT_REQUIRED}
          </h3>
          <p className="mt-2 text-ink-muted">{firstBundle?.description ?? OWNER_INPUT_REQUIRED}</p>
          <TrackedLink
            href="/bundles"
            eventName="select_item"
            payload={{ source: "homepage_bundles" }}
            className="mt-5"
          >
            Explore Bundles
          </TrackedLink>
        </div>
      </Container>

      <section className="bg-surface-muted">
        <Container className="py-12 sm:py-16">
          <SectionHeader
            eyebrow="Customer proof"
            title="Reviews and permissions"
            description="Testimonials, customer photos, and source labels require owner-approved permissions before launch."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.id}
                className="rounded-lg border border-line bg-surface-raised p-5"
              >
                <blockquote className="text-sm leading-6 text-ink-muted">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-ink">
                  {testimonial.sourceLabel}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <Container as="section" className="grid gap-6 py-12 sm:py-16 lg:grid-cols-[1fr_1fr]">
        <SectionHeader
          eyebrow="Corporate gifting"
          title={firstCorporatePackage?.name ?? OWNER_INPUT_REQUIRED}
          description={firstCorporatePackage?.description ?? OWNER_INPUT_REQUIRED}
        />
        <div className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="font-semibold text-ink">MOQ</dt>
              <dd className="text-ink-muted">{OWNER_INPUT_REQUIRED}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Customization</dt>
              <dd className="text-ink-muted">
                {firstCorporatePackage?.customizationOptions.join(", ") ?? OWNER_INPUT_REQUIRED}
              </dd>
            </div>
          </dl>
          <TrackedLink
            href="/corporate-gifts"
            eventName="corporate_enquiry"
            payload={{ source: "homepage_corporate" }}
            className="mt-5"
          >
            Request a Quotation
          </TrackedLink>
        </div>
      </Container>

      <Container as="section" className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="How ordering works"
          title="WhatsApp enquiry flow"
          description="Opening WhatsApp starts an enquiry. Stock, delivery fee, schedule, and payment are confirmed by Tiny Bitty."
        />
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {orderingSteps.map((step, index) => (
            <li key={step.title} className="rounded-lg border border-line bg-surface-raised p-5">
              <span className="text-sm font-bold text-brand-green">{index + 1}</span>
              <h3 className="mt-3 font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>

      <section className="bg-surface-muted">
        <Container className="py-12 sm:py-16">
          <SectionHeader
            eyebrow="Social gallery"
            title="Curated UGC placeholders"
            description="Use optimized local thumbnails after customer photo permissions are approved."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {socialPlaceholders.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-line bg-surface-raised p-4"
              >
                <div className="aspect-square rounded-md bg-[linear-gradient(135deg,rgb(var(--color-brand-green)/0.2),rgb(var(--color-brand-pink)/0.35))]" />
                <h3 className="mt-3 font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{item.label}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <Container as="section" className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions to approve"
          description="FAQ copy should answer ordering, delivery, shelf life, allergens, sweetness, corporate, and cancellation questions once approved."
        />
        <div className="mt-6 divide-y divide-line rounded-lg border border-line bg-surface-raised">
          {visibleFaqs.map((faq) => (
            <details key={faq.id} className="group p-5">
              <summary className="cursor-pointer font-semibold text-ink">{faq.question}</summary>
              <p className="mt-3 text-sm leading-6 text-ink-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
        <Link
          href="/faq"
          className="mt-5 inline-block text-sm font-semibold text-brand-green underline"
        >
          View all FAQs
        </Link>
      </Container>
    </main>
  );
}
