import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";
import { Container } from "@/components/ui/Container";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.privacy);

const privacySections = [
  {
    title: "Information you choose to share",
    body: "When you prepare an order enquiry, Tiny Bitty may ask for your name, mobile number, delivery address, preferred delivery date, order items, and optional notes. For corporate gifting enquiries, the site may ask for company name, contact name, email, phone number, package interest, estimated quantity, desired date, customization notes, and other details you choose to provide.",
  },
  {
    title: "How enquiries are handled",
    body: "The website is designed around enquiry-first ordering. Checkout and corporate gifting details are prepared so you can continue the conversation through WhatsApp. Tiny Bitty uses those details to confirm stock, delivery availability, delivery fees, schedule, packaging needs, and payment instructions before an order is final.",
  },
  {
    title: "Cart and browser storage",
    body: "Your cart can be saved in your browser so items remain available while you browse. This storage stays on your device and can be cleared by removing cart items, clearing the cart, or clearing browser site data.",
  },
  {
    title: "Analytics",
    body: "Tiny Bitty may use analytics tools such as Google Analytics, Meta Pixel, or TikTok Pixel when their public IDs are configured. Analytics events are limited to catalogue, cart, checkout, lead, and contact activity. Customer names, phone numbers, addresses, free-text notes, and other personal message details are not intentionally sent to analytics.",
  },
  {
    title: "Email and WhatsApp",
    body: "If you email or message Tiny Bitty, the information you send is handled by the email or WhatsApp service you use. Please avoid sending sensitive personal information that is not needed to answer your enquiry or confirm your order.",
  },
  {
    title: "Contact for privacy questions",
    body: `For privacy questions, corrections, or requests about an enquiry, contact Tiny Bitty at ${siteConfig.contactEmail}.`,
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <Container className="py-12 sm:py-16">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
            Privacy Policy
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink sm:text-5xl">
            How Tiny Bitty handles enquiry information
          </h1>
          <p className="mt-5 text-base leading-7 text-ink-muted">
            Tiny Bitty is a catalogue and enquiry website. The site helps customers browse cookies,
            prepare order details, and continue the final confirmation through WhatsApp or email.
          </p>
        </section>

        <section className="mt-10 grid gap-4">
          {privacySections.map((section) => (
            <article key={section.title} className="rounded-lg border border-line bg-surface-raised p-5">
              <h2 className="text-xl font-semibold text-ink">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">{section.body}</p>
            </article>
          ))}
        </section>
      </Container>
    </main>
  );
}
