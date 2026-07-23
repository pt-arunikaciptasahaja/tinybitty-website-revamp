import Link from "next/link";
import type { CSSProperties } from "react";
import { bundles } from "@/content/bundles";
import { corporateMoqCopy, corporatePackages } from "@/content/corporate-packages";
import { faqs } from "@/content/faqs";
import { products } from "@/content/products";
import { siteConfig } from "@/content/site-config";
import { testimonials } from "@/content/testimonials";
import { CookieOrbitSticker } from "@/components/home/CookieOrbitSticker";
import { HomeRevealMotion } from "@/components/home/HomeRevealMotion";
import { TrackedLink } from "@/components/home/TrackedLink";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { ProductImage } from "@/features/catalog/ProductImage";

const journeySteps = [
  { label: "Choose", href: "#cookies", color: "mint" },
  { label: "Sweetness", href: "#sweetness", color: "blue" },
  { label: "Bundle", href: "#bundles", color: "yellow" },
  { label: "WhatsApp", href: "#ordering", color: "pink" },
] as const;

const orderingSteps = [
  {
    title: "Choose your cookies",
    body: "Browse the catalogue and open each cookie to compare sizes, ingredients, and sweetness options.",
  },
  {
    title: "Build your enquiry",
    body: "Add products or bundles, then share your preferred delivery area, date, and order notes.",
  },
  {
    title: "Confirm on WhatsApp",
    body: "Tiny Bitty confirms stock, delivery fee, schedule, payment total, and next steps.",
  },
] as const;

const socialComingSoonCards = [
  {
    title: "Customer moments",
    body: "Real Tiny Bitty photos and notes will be featured after each customer gives permission.",
  },
  {
    title: "Behind the scenes",
    body: "Kitchen prep, baking, cooling, and packing stories are being curated.",
  },
  {
    title: "Gift-ready details",
    body: "Packaging, ribbons, cards, and event orders will be shared once final photos are approved.",
  },
] as const;

function Arrow() {
  return (
    <span className="cta-arrow" aria-hidden="true">
      →
    </span>
  );
}

export function HomePageSections() {
  const bestSellers = products.filter((product) => product.category === "cookies").slice(0, 4);
  const firstCorporatePackage = corporatePackages[0];
  const visibleFaqs = faqs.slice(0, 4);
  const heroProducts = bestSellers.slice(0, 2);

  return (
    <main className="home-page" data-homepage>
      <HomeRevealMotion />

      <section className="home-hero">
        <svg
          className="hero-crumb-path hero-crumb-path--desktop"
          viewBox="0 0 1200 700"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            pathLength="100"
            d="M 105 365 C 360 440, 590 220, 785 295 C 850 175, 1035 155, 1100 290 C 1170 435, 1070 590, 915 575 C 760 560, 690 410, 770 300 C 850 190, 1030 230, 1045 365"
          />
        </svg>
        <svg
          className="hero-crumb-path hero-crumb-path--mobile"
          viewBox="0 0 400 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            pathLength="100"
            d="M 55 285 C 220 330, 305 440, 310 585 C 320 760, 260 900, 130 875 C 15 850, 5 650, 120 575 C 240 500, 350 620, 305 770"
          />
        </svg>
        <Container className="home-hero__inner">
          <nav className="journey-rail" aria-label="How to order">
            {journeySteps.map((step, index) => (
              <a key={step.label} href={step.href} className="journey-rail__item">
                <span
                  className={`journey-rail__dot journey-rail__dot--${step.color}`}
                  aria-hidden="true"
                />
                <span className="journey-rail__number">{String(index + 1).padStart(2, "0")}</span>
                <span>{step.label}</span>
              </a>
            ))}
          </nav>

          <div className="home-hero__grid">
            <div className="home-hero__copy">
              <p className="home-kicker">Homemade cookies · made for sharing</p>
              <h1>Little bites that bring people together.</h1>
              <p className="home-hero__lede">
                Choose a cookie, pick the size and sweetness that fits, then continue your enquiry
                on WhatsApp. Tiny Bitty confirms the details with you before every order.
              </p>
              <div className="home-hero__actions">
                <TrackedLink
                  href="/cookies"
                  eventName="select_item"
                  payload={{ source: "homepage_hero_primary" }}
                  size="lg"
                  className="tactile-button"
                >
                  Shop best sellers
                </TrackedLink>
                <TrackedLink
                  href="/corporate-gifts"
                  eventName="corporate_enquiry"
                  payload={{ source: "homepage_hero_secondary" }}
                  size="lg"
                  variant="outline"
                  className="tactile-button tactile-button--outline"
                >
                  Corporate orders <Arrow />
                </TrackedLink>
              </div>
              <p className="home-hero__note">
                Stock · delivery fee · schedule · payment confirmed on WhatsApp
              </p>
            </div>

            <div className="cookie-orbit" aria-label="Featured Tiny Bitty cookies">
              {heroProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/cookies/${product.slug}`}
                  className={`cookie-orbit__card cookie-orbit__card--${index + 1}`}
                >
                  <ProductImage product={product} className="cookie-orbit__image" />
                  <span className="cookie-orbit__label">{product.name}</span>
                </Link>
              ))}
              <div className="cookie-orbit__note" data-reveal>
                <CookieOrbitSticker />
                <p>
                  <strong>Pick your favorite.</strong>
                  <br />
                  We’ll help with the rest.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="cookies" className="home-section home-section--catalog">
        <Container>
          <header className="home-section__header" data-reveal>
            <div>
              <p className="home-kicker">The cookie shelf</p>
              <h2>Start with a favorite.</h2>
            </div>
            <p>
              Four distinct cookies, each available in multiple sizes. Open a product to check its
              ingredients, allergens, storage notes, and available sweetness options.
            </p>
          </header>

          <div className="cookie-grid">
            {bestSellers.map((product, index) => {
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
                  className="cookie-card"
                  data-reveal
                  style={{ "--reveal-order": index } as CSSProperties}
                >
                  <Link href={`/cookies/${product.slug}`} tabIndex={-1} aria-hidden="true">
                    <ProductImage product={product} className="cookie-card__image" />
                  </Link>
                  <div className="cookie-card__body">
                    <p className="cookie-card__index">{String(index + 1).padStart(2, "0")}</p>
                    <h3>{product.name}</h3>
                    <p className="cookie-card__description">{product.shortDescription}</p>
                    {variant ? (
                      <p className="cookie-card__price">
                        {variant.label} · <Price amount={variant.price.amount} />
                      </p>
                    ) : null}
                    <TrackedLink
                      href={`/cookies/${product.slug}`}
                      eventName="select_item"
                      payload={{ source: "homepage_best_sellers", items: [analyticsItem] }}
                      variant="ghost"
                      className="cookie-card__link"
                    >
                      View details <Arrow />
                    </TrackedLink>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="sweetness" className="home-section home-section--sweetness">
        <Container className="sweetness-layout">
          <div className="sweetness-layout__copy" data-reveal>
            <p className="home-kicker">Your kind of sweet</p>
            <h2>Same cookie. Your sweetness.</h2>
            <p>
              Most Tiny Bitty cookies can be prepared in normal sugar or less sugar, so the flavor
              can fit your table, gift box, or office treat.
            </p>
          </div>
          <div className="sweetness-options" data-reveal>
            <article>
              <span aria-hidden="true">100</span>
              <div>
                <h3>Normal sugar</h3>
                <p>
                  A fuller, classic sweetness that brings the buttery dough and toppings forward.
                </p>
              </div>
            </article>
            <article>
              <span aria-hidden="true">½</span>
              <div>
                <h3>Less sugar</h3>
                <p>A lighter sweetness for a more ingredient-led bite.</p>
              </div>
            </article>
          </div>
        </Container>
      </section>

      <section id="bundles" className="home-section home-section--bundles">
        <Container>
          <header className="home-section__header" data-reveal>
            <div>
              <p className="home-kicker">Ready to share</p>
              <h2>Bundle the good stuff.</h2>
            </div>
            <p>
              Choose Mini, Small, Medium, or Large. Each set combines non-seasonal Tiny Bitty
              favorites and saves Rp5.000 from the normal total.
            </p>
          </header>
          <div className="bundle-track">
            {bundles.map((bundle, index) => (
              <article
                key={bundle.id}
                className="bundle-card"
                data-reveal
                style={{ "--reveal-order": index } as CSSProperties}
              >
                <p className="bundle-card__number">{String(index + 1).padStart(2, "0")}</p>
                <h3>{bundle.name}</h3>
                {bundle.bundlePrice ? (
                  <p className="bundle-card__price">
                    <Price amount={bundle.bundlePrice.amount} />
                  </p>
                ) : (
                  <p>Bundle price confirmed via WhatsApp.</p>
                )}
                <p>Save Rp5.000 from the normal total.</p>
              </article>
            ))}
          </div>
          <TrackedLink
            href="/bundles"
            eventName="select_item"
            payload={{ source: "homepage_bundles" }}
            variant="outline"
            className="home-inline-cta"
          >
            Explore all bundles <Arrow />
          </TrackedLink>
        </Container>
      </section>

      <section id="ordering" className="home-section home-section--ordering">
        <Container>
          <header className="ordering-heading" data-reveal>
            <p className="home-kicker">How ordering works</p>
            <h2>Three small steps. One helpful chat.</h2>
            <p>
              Opening WhatsApp starts an enquiry—not a purchase. Tiny Bitty confirms every order
              detail with you first.
            </p>
          </header>
          <ol className="order-steps">
            {orderingSteps.map((step, index) => (
              <li
                key={step.title}
                className="order-step"
                data-reveal
                style={{ "--reveal-order": index } as CSSProperties}
              >
                <div className="order-step__node">{index + 1}</div>
                {index < orderingSteps.length - 1 ? (
                  <span className="order-step__line" aria-hidden="true" />
                ) : null}
                <div className="order-step__panel">
                  <p>Step {index + 1}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="home-section home-section--corporate">
        <Container className="corporate-layout">
          <div data-reveal>
            <p className="home-kicker">Corporate gifting</p>
            <h2>Cookies that arrive ready for the occasion.</h2>
            <p>
              Start with a curated gift box or request a custom corporate order. Tiny Bitty will
              confirm the cookie mix, packaging direction, quantity, timing, delivery, and final
              quotation before production starts.
            </p>
            <TrackedLink
              href="/corporate-gifts"
              eventName="corporate_enquiry"
              payload={{ source: "homepage_corporate" }}
              size="lg"
              className="tactile-button"
            >
              Request a quotation
            </TrackedLink>
          </div>
          <dl className="corporate-facts" data-reveal>
            <div>
              <dt>Best for</dt>
              <dd>Meetings, seminars, grand openings, client visits, and company celebrations</dd>
            </div>
            <div>
              <dt>MOQ</dt>
              <dd>{corporateMoqCopy}</dd>
            </div>
            <div>
              <dt>Customization</dt>
              <dd>
                {firstCorporatePackage?.customizationOptions.join(", ") ??
                  "Customization details confirmed during enquiry"}
              </dd>
            </div>
            <div>
              <dt>Lead time</dt>
              <dd>
                {firstCorporatePackage?.leadTime ?? "Confirmed after package and quantity review"}
              </dd>
            </div>
          </dl>
        </Container>
      </section>

      <section className="home-section home-section--proof">
        <Container>
          <header className="home-section__header" data-reveal>
            <div>
              <p className="home-kicker">From the table</p>
              <h2>Customer notes, shared with care.</h2>
            </div>
            <p>
              Testimonials and customer photos appear only after their source and sharing permission
              are confirmed.
            </p>
          </header>
          <div className="proof-grid">
            {testimonials.map((testimonial, index) => (
              <figure
                key={testimonial.id}
                data-reveal
                style={{ "--reveal-order": index } as CSSProperties}
              >
                <blockquote>{testimonial.quote}</blockquote>
                <figcaption>
                  <span className="testimonial-attribution__name">{testimonial.sourceLabel}</span>
                  <span className="testimonial-attribution__role">{testimonial.jobTitle}</span>
                </figcaption>
              </figure>
            ))}
            <article className="proof-placeholder" data-reveal>
              <p>More approved customer notes will join this table soon.</p>
              <span>Customer review pending approval</span>
            </article>
          </div>
        </Container>
      </section>

      <section className="home-section home-section--journal">
        <Container>
          <header className="home-section__header" data-reveal>
            <div>
              <p className="home-kicker">Tiny Bitty moments</p>
              <h2>A closer look is coming.</h2>
            </div>
            <p>
              Customer moments, kitchen stories, and gift-ready details will be added as their
              photos and permissions are approved.
            </p>
          </header>
          <div className="journal-grid">
            {socialComingSoonCards.map((item, index) => (
              <article
                key={item.title}
                data-reveal
                style={{ "--reveal-order": index } as CSSProperties}
              >
                <span>Coming soon</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="home-section home-section--faq">
        <Container className="faq-layout">
          <div data-reveal>
            <p className="home-kicker">Before you order</p>
            <h2>Questions? Start here.</h2>
            <p>
              Quick answers about sizes, sweetness, storage, allergens, delivery, payment, and
              corporate gifting.
            </p>
            <Link href="/faq" className="home-text-link">
              View all FAQs <Arrow />
            </Link>
          </div>
          <div className="faq-list" data-reveal>
            {visibleFaqs.map((faq) => (
              <details key={faq.id}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="home-closing">
        <Container data-reveal>
          <p className="home-kicker">Start with one box</p>
          <h2>Bring something little. Make the moment bigger.</h2>
          <p>{siteConfig.footerNote}</p>
          <TrackedLink
            href="/cookies"
            eventName="select_item"
            payload={{ source: "homepage_closing" }}
            size="lg"
            className="tactile-button"
          >
            Choose your cookies <Arrow />
          </TrackedLink>
        </Container>
      </section>
    </main>
  );
}
