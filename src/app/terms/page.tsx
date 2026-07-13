import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";
import { Container } from "@/components/ui/Container";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.terms);

const termSections = [
  {
    title: "Enquiry-first ordering",
    body: "The website helps you browse the catalogue, prepare cart details, and start an enquiry. Submitting details or opening WhatsApp does not automatically create a confirmed purchase. Tiny Bitty confirms stock, delivery timing, delivery fee, payment instructions, and any packaging or corporate details before an order is final.",
  },
  {
    title: "Product and bundle information",
    body: "Product, bundle, and corporate gifting details are provided so customers can decide what to ask about. Availability may change, and seasonal products or package details may require confirmation before payment.",
  },
  {
    title: "Prices, fees, and payment",
    body: "Displayed product prices are used for catalogue guidance when available. Delivery fees, final totals, payment instructions, and any approved packaging or corporate adjustments are confirmed directly by Tiny Bitty before the order is accepted.",
  },
  {
    title: "Delivery",
    body: "Delivery is available only for selected areas and depends on destination, stock, preparation time, courier availability, and schedule. Same-day delivery may be possible in selected areas, but it must be confirmed through the enquiry flow.",
  },
  {
    title: "Changes and cancellations",
    body: "If you need to change or cancel an enquiry, contact Tiny Bitty as soon as possible. Changes and cancellations can only be reviewed before preparation, packing, or delivery arrangements have started.",
  },
  {
    title: "Corporate and gift orders",
    body: "Corporate gifts, bulk orders, custom packaging, cards, ribbons, or event-related requests may require additional lead time and confirmation. Tiny Bitty will review quantity, schedule, and packaging needs before finalizing the quotation.",
  },
  {
    title: "Contact",
    body: `For questions about these terms or an order enquiry, contact Tiny Bitty at ${siteConfig.contactEmail} or continue through WhatsApp.`,
  },
];

export default function TermsPage() {
  return (
    <main>
      <Container className="py-12 sm:py-16">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
            Terms
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink sm:text-5xl">
            Terms for browsing and order enquiries
          </h1>
          <p className="mt-5 text-base leading-7 text-ink-muted">
            These terms explain how Tiny Bitty handles catalogue browsing, WhatsApp enquiries,
            delivery confirmation, and order finalization for the current website.
          </p>
        </section>

        <section className="mt-10 grid gap-4">
          {termSections.map((section) => (
            <article key={section.title} className="rounded-lg border border-line bg-surface-raised p-5">
              <h2 className="text-xl font-semibold text-ink">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">{section.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-lg border border-dashed border-line bg-surface-muted p-5">
          <h2 className="text-xl font-semibold text-ink">Important note</h2>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Tiny Bitty does not currently process payment on the website. Payment details are shared
            only after Tiny Bitty confirms the order details directly with the customer.
          </p>
        </section>
      </Container>
    </main>
  );
}
