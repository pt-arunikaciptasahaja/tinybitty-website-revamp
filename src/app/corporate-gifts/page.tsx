import type { Metadata } from "next";
import { corporateMoqCopy, corporatePackages } from "@/content/corporate-packages";
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
              Cookie gifts made for memorable business moments
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
              Thoughtfully prepared cookie gifts for client appreciation, internal events,
              meetings, grand openings, seminars, and milestone celebrations. Tell us about the
              occasion, quantity, and timing, and Tiny Bitty will recommend a cookie mix and
              packaging direction before confirming the final quotation.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-ink-muted sm:grid-cols-3">
              {[
                "Ideal for meetings, seminars, grand openings, client visits, and company celebrations",
                corporateMoqCopy,
                "Final quotation confirms the cookie mix, packaging, stock, schedule, delivery, and payment details",
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
              Every corporate enquiry is reviewed before production starts. Cookie sizes, flavor
              mix, packaging, quantity, lead time, delivery fee, schedule, and payment details are
              confirmed clearly before the order is finalized.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <SectionHeader
            eyebrow="Packages"
            title="Corporate cookie packages tailored to your event"
            description="Start with a curated gift box or request a custom arrangement based on your guest list, event format, preferred cookie size, packaging needs, and delivery schedule."
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
                    <dt className="font-semibold text-ink">Quotation</dt>
                    <dd className="text-ink-muted">
                      {packageTier.startingPrice ? (
                        <Price amount={packageTier.startingPrice.amount} />
                      ) : (
                        "Prepared after package and quantity review"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink">MOQ</dt>
                    <dd className="text-ink-muted">{corporateMoqCopy}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink">Lead time</dt>
                    <dd className="text-ink-muted">
                      {packageTier.leadTime ?? "Confirmed after package and quantity review"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-ink">Package may include</p>
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
            title="Packaging and personalization"
            items={[
              "Select the cookie size and mix that fit the occasion, from simple meeting treats to more polished client gifts.",
              "Add gift notes or message cards for team appreciation, event guests, or client deliveries.",
              "Share packaging, message card, and branding preferences during enquiry so production details can be reviewed before confirmation.",
            ]}
          />
          <InfoPanel
            title="Order planning"
            items={[
              "Mini 30gr and Small 100gr corporate orders start from 50 pcs.",
              "Medium 150gr and Large 400gr corporate orders start from 30 pcs.",
              "Production timing and delivery schedule are confirmed after quantity, size, and packaging details are reviewed.",
            ]}
          />
        </section>

        <section className="mt-14">
          <SectionHeader
            eyebrow="Process"
            title="How corporate enquiries work"
            description="A clear enquiry flow helps your team confirm size, quantity, packaging, timing, and delivery details before production starts."
          />
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              {
                title: "Submit enquiry",
                body: "Share the event, cookie size, quantity, preferred date, and any packaging notes.",
              },
              {
                title: "Shape the package",
                body: "Tiny Bitty recommends cookie options, package format, and order details.",
              },
              {
                title: "Confirm schedule",
                body: "Stock, lead time, production timing, delivery fee, and delivery schedule are reviewed.",
              },
              {
                title: "Finalize payment",
                body: "The order moves forward only after the quotation and payment details are confirmed.",
              },
            ].map((step, index) => (
              <li key={step.title} className="rounded-lg border border-line bg-surface-raised p-4">
                <p className="text-sm font-semibold text-brand-green">Step {index + 1}</p>
                <p className="mt-2 font-semibold text-ink">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 rounded-lg border border-dashed border-line bg-surface-muted p-5">
          <h2 className="text-xl font-semibold text-ink">Client examples and event proof</h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Approved photos, testimonials, client names, logos, or past event examples can be added
            here after permission is confirmed.
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
