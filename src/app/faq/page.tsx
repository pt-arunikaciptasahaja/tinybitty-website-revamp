import type { Metadata } from "next";
import type { FAQ } from "@/content/schemas";
import { faqs } from "@/content/faqs";
import { siteConfig } from "@/content/site-config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FaqJsonLd } from "@/features/seo/FaqJsonLd";
import { buildMetadata, routeSeo } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = buildMetadata(routeSeo.faq);

const categorySections = [
  {
    id: "products",
    eyebrow: "Products",
    title: "Cookies, sizes, sweetness, and ingredients",
    description:
      "Helpful details about Tiny Bitty cookie flavours, size options, sweetness choices, ingredients, allergens, shelf life, and storage.",
  },
  {
    id: "ordering",
    eyebrow: "Ordering",
    title: "Ordering and payment",
    description:
      "How the WhatsApp enquiry flow works before your cookie order is confirmed.",
  },
  {
    id: "delivery",
    eyebrow: "Delivery",
    title: "Delivery areas, timing, and fees",
    description:
      "Delivery availability depends on your area, stock, preparation time, and courier schedule.",
  },
  {
    id: "corporate",
    eyebrow: "Corporate gifts",
    title: "Business orders and event gifting",
    description:
      "Guidance for meeting treats, client gifts, event packages, custom packaging, and bulk quantities.",
  },
  {
    id: "legal",
    eyebrow: "Confirmation",
    title: "Final order confirmation",
    description:
      "The order is only final after Tiny Bitty confirms every commercial detail through WhatsApp.",
  },
] as const satisfies Array<{
  id: FAQ["category"];
  eyebrow: string;
  title: string;
  description: string;
}>;

export default function FaqPage() {
  const whatsappHref =
    buildWhatsAppUrl(
      siteConfig.whatsappNumber,
      "Halo Tiny Bitty, saya ingin bertanya tentang produk, order, atau delivery.",
    ) ?? "/contact";

  return (
    <main>
      <FaqJsonLd faqs={faqs} />
      <Container className="py-12 sm:py-16">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
              Frequently Asked Questions
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink sm:text-5xl">
              Everything to know before ordering Tiny Bitty cookies
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
              Find answers about cookie flavours, sizes, sweetness options, storage, allergens,
              delivery, payment, and corporate gifting. Every order still ends with a WhatsApp
              confirmation so stock, timing, delivery fee, and payment details are clear.
            </p>
          </div>

          <section className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
            <h2 className="text-xl font-semibold text-ink">Still have questions?</h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Send Tiny Bitty a message and we will help confirm the right cookie size, delivery
              plan, gifting option, or corporate order details.
            </p>
            <Button href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-5">
              Chat via WhatsApp
            </Button>
          </section>
        </section>

        <div className="mt-14 grid gap-8">
          {categorySections.map((section) => {
            const sectionFaqs = faqs.filter((faq) => faq.category === section.id);

            if (sectionFaqs.length === 0) {
              return null;
            }

            return (
              <section key={section.id}>
                <SectionHeader
                  eyebrow={section.eyebrow}
                  title={section.title}
                  description={section.description}
                />
                <div className="mt-5 divide-y divide-line rounded-lg border border-line bg-surface-raised">
                  {sectionFaqs.map((faq) => (
                    <details key={faq.id} className="group p-5">
                      <summary className="cursor-pointer list-none font-semibold text-ink">
                        <span>{faq.question}</span>
                      </summary>
                      <p className="mt-3 text-sm leading-6 text-ink-muted">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
