import type { Metadata } from "next";
import { corporatePackages } from "@/content/corporate-packages";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CorporateEnquiryForm } from "@/features/corporate/CorporateEnquiryForm";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.corporateGifts);

export default function CorporateGiftsPage() {
  return (
    <main>
      <Container className="py-12 sm:py-16">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
              Corporate gifts
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink sm:text-5xl">
              Corporate gifting by quotation
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
              [OWNER_INPUT_REQUIRED]
            </p>
            <div className="mt-6 grid gap-3 text-sm text-ink-muted sm:grid-cols-3">
              {[
                "Use case: [OWNER_INPUT_REQUIRED]",
                "MOQ: [OWNER_INPUT_REQUIRED]",
                "Lead time: [OWNER_INPUT_REQUIRED]",
              ].map((item) => (
                <p key={item} className="rounded-lg border border-line bg-surface-raised p-4">
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
            <h2 className="font-semibold text-ink">Confirmation required</h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted">
              Package contents, MOQ, lead time, stock, delivery fee, schedule, and payment are
              confirmed after enquiry.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <SectionHeader
            eyebrow="Packages"
            title="Configurable package tiers"
            description="Commercial details stay placeholder-safe until approved by the owner."
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {corporatePackages.map((packageTier) => (
              <article
                key={packageTier.id}
                className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-green">
                  {packageTier.status === "active" ? "Available" : "Draft"}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-ink">{packageTier.name}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-muted">{packageTier.description}</p>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div>
                    <dt className="font-semibold text-ink">Starting price</dt>
                    <dd className="text-ink-muted">
                      {packageTier.startingPrice ? (
                        <Price amount={packageTier.startingPrice.amount} />
                      ) : (
                        "[OWNER_INPUT_REQUIRED]"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink">MOQ</dt>
                    <dd className="text-ink-muted">
                      {packageTier.minimumOrderQuantity ?? "[OWNER_INPUT_REQUIRED]"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink">Lead time</dt>
                    <dd className="text-ink-muted">
                      {packageTier.leadTime ?? "[OWNER_INPUT_REQUIRED]"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-ink">Included</p>
                  <ul className="mt-2 grid gap-2 text-sm text-ink-muted">
                    {packageTier.includedItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <InfoPanel
            title="Customization"
            items={[
              "Packaging: [OWNER_INPUT_REQUIRED]",
              "Message cards: [OWNER_INPUT_REQUIRED]",
              "Branding options: [OWNER_INPUT_REQUIRED]",
            ]}
          />
          <InfoPanel
            title="MOQ and lead time"
            items={[
              "Minimum quantity: [OWNER_INPUT_REQUIRED]",
              "Production lead time: [OWNER_INPUT_REQUIRED]",
              "Delivery schedule: [OWNER_INPUT_REQUIRED]",
            ]}
          />
        </section>

        <section className="mt-14">
          <SectionHeader
            eyebrow="Process"
            title="How corporate enquiries work"
            description="The flow stays enquiry-first until Tiny Bitty confirms every commercial detail."
          />
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "Submit enquiry",
              "Confirm package details",
              "Confirm schedule and delivery",
              "Confirm payment",
            ].map((step, index) => (
              <li key={step} className="rounded-lg border border-line bg-surface-raised p-4">
                <p className="text-sm font-semibold text-brand-green">Step {index + 1}</p>
                <p className="mt-2 font-semibold text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 rounded-lg border border-dashed border-line bg-surface-muted p-5">
          <h2 className="text-xl font-semibold text-ink">Proof and client examples</h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            [OWNER_INPUT_REQUIRED] Approved client names, testimonials, logos, photos, or examples
            can be added here only after permission is confirmed.
          </p>
        </section>

        <section className="mt-14">
          <CorporateEnquiryForm packages={corporatePackages} />
        </section>
      </Container>
    </main>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <ul className="mt-4 grid gap-3 text-sm text-ink-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
