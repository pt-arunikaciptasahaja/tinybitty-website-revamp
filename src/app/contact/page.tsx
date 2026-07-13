import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { buildMetadata, routeSeo } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = buildMetadata(routeSeo.contact);

const contactEmailHref = `mailto:${siteConfig.contactEmail}?subject=Tiny%20Bitty%20enquiry`;

export default function ContactPage() {
  const whatsappHref =
    buildWhatsAppUrl(
      siteConfig.whatsappNumber,
      "Halo Tiny Bitty, saya ingin bertanya tentang menu, delivery, atau pemesanan.",
    ) ?? "/contact";

  return (
    <main>
      <Container className="py-12 sm:py-16">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
              Contact
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink sm:text-5xl">
              Ask about cookies, delivery, and gift-ready orders
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
              Tiny Bitty handles every order as an enquiry first, so the team can confirm stock,
              delivery timing, fees, packaging details, and payment instructions before anything is
              finalized.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </Button>
              <Button href={contactEmailHref} variant="outline">
                Email Tiny Bitty
              </Button>
            </div>
          </div>

          <section className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
            <h2 className="font-semibold text-ink">Direct contact</h2>
            <dl className="mt-4 grid gap-4 text-sm text-ink-muted">
              <div>
                <dt className="font-semibold text-ink">Email</dt>
                <dd className="mt-1">
                  <a
                    className="font-semibold text-brand-green hover:underline"
                    href={contactEmailHref}
                  >
                    {siteConfig.contactEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">WhatsApp</dt>
                <dd className="mt-1">
                  <a
                    className="font-semibold text-brand-green hover:underline"
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    0811-1201-0160
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Order hours</dt>
                <dd className="mt-1 leading-6">
                  Monday-Saturday: 8:00 AM-8:00 PM
                  <br />
                  Sunday: 9:00 AM-6:00 PM
                </dd>
              </div>
            </dl>
          </section>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Product questions",
              body: "Ask about cookie options, serving sizes, sweetness preferences, and availability before building your order.",
            },
            {
              title: "Delivery planning",
              body: "Share your area and preferred date so Tiny Bitty can confirm delivery availability, timing, and fees.",
            },
            {
              title: "Gifts and corporate orders",
              body: "Send the quantity, occasion, packaging needs, and target delivery date for bundle or corporate enquiries.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-lg border border-line bg-surface-raised p-5">
              <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-14 rounded-lg border border-dashed border-line bg-surface-muted p-5">
          <h2 className="text-xl font-semibold text-ink">What to include in your message</h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            For faster confirmation, include the product or bundle you are interested in, quantity,
            delivery area, preferred date, and any gift or corporate packaging notes. Tiny Bitty
            will confirm the final details before the order is accepted.
          </p>
        </section>
      </Container>
    </main>
  );
}
