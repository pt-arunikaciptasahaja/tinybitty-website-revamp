import Link from "next/link";
import { bundles } from "@/content/bundles";
import { corporateMoqCopy, corporatePackages } from "@/content/corporate-packages";
import { faqs } from "@/content/faqs";
import { products } from "@/content/products";
import { OWNER_INPUT_REQUIRED } from "@/content/schemas";
import { siteConfig } from "@/content/site-config";
import { testimonials } from "@/content/testimonials";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrackedLink } from "@/components/home/TrackedLink";
import { ProductImage } from "@/features/catalog/ProductImage";

// Social media cards
const socialComingSoonCards = [
  {
    title: "Customer moments",
    body: "Real Tiny Bitty photos and notes will be featured after each customer gives permission.",
  },
  {
    title: "Behind the scenes",
    body: "Kitchen prep, baking, cooling, and packing stories are being curated for a closer look at the process.",
  },
  {
    title: "Gift-ready details",
    body: "Packaging, ribbons, cards, and event orders will be shared once final photos are approved.",
  },
];

const reviewPermissionCards = [
  {
    quote:
      "More customer notes are being prepared for this section, with permission confirmed before each review is published.",
    sourceLabel: "Customer review pending approval",
  },
  {
    quote:
      "Gift moments, event orders, and customer photos can be featured here once the source and usage permission are confirmed.",
    sourceLabel: "Photo permission pending approval",
  },
];

const heroOccasions = [
  "sharing",
  "gifting",
  "family gatherings",
  "office meetings",
  "corporate events",
];
const heroImageUrl =
  "https://res.cloudinary.com/dodmwwp1w/image/upload/v1783765265/ChatGPT_Image_Jul_11_2026_05_20_36_PM_wk6whw.png";
const heroMobileImageUrl =
  "https://res.cloudinary.com/dodmwwp1w/image/upload/v1783766266/ChatGPT_Image_Jul_11_2026_05_37_28_PM_vsdwew.png";

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
  const firstCorporatePackage = corporatePackages[0];
  const visibleFaqs = faqs.slice(0, 4);

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-brand-green">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center sm:hidden"
          style={{ backgroundImage: `url(${heroMobileImageUrl})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-20 hidden bg-cover bg-center sm:block"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(16_39_32/0.16),rgb(16_39_32/0.52)_28%,rgb(16_39_32/0.6)_50%,rgb(16_39_32/0.52)_72%,rgb(16_39_32/0.16))]" />
        <Container className="grid min-h-[42rem] grid-rows-[1fr_auto] justify-items-center gap-8 py-8 text-center sm:min-h-[42rem] sm:py-10 lg:min-h-[46rem]">
          <div className="mx-auto grid max-w-3xl content-center self-center">
            <p className="mx-auto max-w-2xl font-montserrat-heading text-3xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {siteConfig.description}
            </p>
            <p
              className="mt-4 font-montserrat-heading text-sm font-bold uppercase tracking-[0.1em] text-white/85 sm:mt-3 sm:text-lg"
              aria-label="Freshly baked cookies for sharing, gifting, family gatherings, office meetings, and corporate events."
            >
              <span aria-hidden="true">Freshly baked cookies for</span>{" "}
              <span
                className="hero-occasion-rotator relative inline-grid min-w-[18ch] overflow-hidden pb-1 text-center align-baseline font-montserrat-heading text-base font-extrabold normal-case tracking-normal text-white sm:min-w-[14ch] sm:text-left sm:text-2xl"
                aria-hidden="true"
              >
                {heroOccasions.map((occasion) => (
                  <span key={occasion} className="hero-occasion-word col-start-1 row-start-1">
                    {occasion}
                  </span>
                ))}
              </span>
            </p>
          </div>
          <div className="flex w-full max-w-md justify-center gap-3 self-end">
            <TrackedLink
              href="/cookies"
              eventName="select_item"
              payload={{ source: "homepage_hero_primary" }}
              size="sm"
              variant="outline"
              className="h-10 flex-1 !border-white bg-brand-green/55 px-3 text-sm !text-white shadow-raised backdrop-blur hover:bg-brand-green/70 sm:h-12 sm:!border-white sm:bg-white/20 sm:px-5 sm:text-base sm:!text-white sm:shadow-[0_12px_32px_rgb(0_0_0/0.22)] sm:ring-1 sm:ring-white/30 sm:backdrop-blur-md sm:hover:bg-white/30"
            >
              Shop Best Sellers
            </TrackedLink>
            <TrackedLink
              href="/corporate-gifts"
              eventName="corporate_enquiry"
              payload={{ source: "homepage_hero_secondary" }}
              size="sm"
              variant="outline"
              className="h-10 flex-1 !border-white bg-brand-green/55 px-3 text-sm !text-white shadow-raised backdrop-blur hover:bg-brand-green/70 sm:h-12 sm:!border-white sm:bg-white/20 sm:px-5 sm:text-base sm:!text-white sm:shadow-[0_12px_32px_rgb(0_0_0/0.22)] sm:ring-1 sm:ring-white/30 sm:backdrop-blur-md sm:hover:bg-white/30"
            >
              Corporate Orders
            </TrackedLink>
          </div>
        </Container>
      </section>

      <Container as="section" className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="Best sellers"
          title="Cookie catalogue"
          description="Explore Tiny Bitty favourites for everyday treats, thoughtful gifts, and shared dessert tables. Each cookie listing includes the details you need before continuing your order through WhatsApp."
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
                <ProductImage
                  product={product}
                  className="rounded-md bg-[linear-gradient(135deg,rgb(var(--color-brand-pink)/0.35),rgb(var(--color-brand-lime)/0.3))]"
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
            title="Choose your sweetness"
            description="Most Tiny Bitty cookies can be prepared in normal sugar or half sugar, so you can match the flavor to your table, gift box, or office treat."
          />
          <div className="grid gap-3 rounded-lg border border-line bg-surface-raised p-4">
            <div className="rounded-md bg-brand-pink/25 p-4">
              <h3 className="font-semibold text-ink">Normal sugar</h3>
              <p className="mt-2 text-sm text-ink-muted">
                A fuller, classic cookie sweetness that brings out the buttery dough, chocolate,
                nuts, and toppings in every bite.
              </p>
            </div>
            <div className="rounded-md bg-brand-lime/25 p-4">
              <h3 className="font-semibold text-ink">Half sugar</h3>
              <p className="mt-2 text-sm text-ink-muted">
                A lighter sweetness for customers who prefer the cookie texture and ingredient
                flavors to sit more forward.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container as="section" className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="Bundles"
          title="Bundle offers"
          description="Choose a ready-to-share cookie set in Mini, Small, Medium, or Large. Each bundle combines non-seasonal Tiny Bitty favourites and saves Rp5.000 from the normal total."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bundles.map((bundle) => (
            <article
              key={bundle.id}
              className="rounded-lg border border-line bg-surface-raised p-4 shadow-soft"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-green">
                Bundle set
              </p>
              <h3 className="mt-2 min-h-14 text-lg font-semibold leading-7 text-ink">
                {bundle.name}
              </h3>
              {bundle.bundlePrice ? (
                <p className="mt-3 text-sm font-semibold text-brand-green">
                  <Price amount={bundle.bundlePrice.amount} />
                </p>
              ) : (
                <p className="mt-3 text-sm text-ink-muted">Bundle price: {OWNER_INPUT_REQUIRED}</p>
              )}
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Save Rp5.000 from the normal total.
              </p>
            </article>
          ))}
        </div>
        <div className="mt-6">
          <TrackedLink
            href="/bundles"
            eventName="select_item"
            payload={{ source: "homepage_bundles" }}
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
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.id}
                className="grid h-full content-between gap-4 rounded-lg border border-line bg-surface-raised p-5"
              >
                <blockquote className="text-sm leading-6 text-ink-muted">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="text-sm font-semibold text-ink">
                  {testimonial.sourceLabel}
                </figcaption>
              </figure>
            ))}
            {reviewPermissionCards.map((card) => (
              <figure
                key={card.sourceLabel}
                className="grid h-full content-between gap-4 rounded-lg border border-dashed border-line bg-surface-raised p-5"
              >
                <blockquote className="text-sm leading-6 text-ink-muted">{card.quote}</blockquote>
                <figcaption className="text-sm font-semibold text-ink">
                  {card.sourceLabel}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <Container as="section" className="grid gap-6 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <SectionHeader
          eyebrow="Corporate gifting"
          title="Cookie gifts for meetings, events, and client appreciation"
          description="Start with a curated gift box or request a custom corporate order. Tiny Bitty will help confirm the cookie mix, packaging direction, quantity, timing, delivery, and final quotation before production starts."
        />
        <div className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-ink">Best for</dt>
              <dd className="mt-1 text-ink-muted">
                Meetings, seminars, grand openings, client visits, and company celebrations
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">MOQ</dt>
              <dd className="mt-1 text-ink-muted">{corporateMoqCopy}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Customization</dt>
              <dd className="mt-1 text-ink-muted">
                {firstCorporatePackage?.customizationOptions.join(", ") ?? OWNER_INPUT_REQUIRED}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Lead time</dt>
              <dd className="mt-1 text-ink-muted">
                {firstCorporatePackage?.leadTime ?? "Confirmed after package and quantity review"}
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
            title="Tiny Bitty moments, coming soon"
            description="A more personal gallery is on the way, featuring customer moments, behind-the-scenes baking, and gift-ready details once every photo and story has been approved for sharing."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {socialComingSoonCards.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-green">
                  Coming soon
                </p>
                <h3 className="mt-3 font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <Container as="section" className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions before you order?"
          description="Find quick answers about cookie sizes, sweetness options, storage, allergens, delivery, payment, and corporate gifting."
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
