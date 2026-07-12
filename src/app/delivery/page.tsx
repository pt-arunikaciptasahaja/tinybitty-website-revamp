import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { buildMetadata, routeSeo } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = buildMetadata(routeSeo.delivery);

export default function DeliveryPage() {
  const whatsappHref =
    buildWhatsAppUrl(
      siteConfig.whatsappNumber,
      "Halo Tiny Bitty, saya ingin konfirmasi area, jadwal, dan biaya delivery.",
    ) ?? "/contact";

  return (
    <main>
      <Container className="py-12 sm:py-16">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
              Delivery
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink sm:text-5xl">
              Delivery details confirmed before your order is final
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
              Tiny Bitty delivers to selected Jabodetabek and Bandung areas. Same-day delivery may
              be available depending on your location, order timing, stock, and delivery schedule.
              Please confirm the area and fee through WhatsApp before checkout.
            </p>
            <div className="mt-7">
              <Button href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Confirm delivery via WhatsApp
              </Button>
            </div>
          </div>

          <section className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
            <h2 className="font-semibold text-ink">Order and contact hours</h2>
            <dl className="mt-4 grid gap-3 text-sm text-ink-muted">
              <div>
                <dt className="font-semibold text-ink">Monday-Saturday</dt>
                <dd className="mt-1">8:00 AM-8:00 PM</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Sunday</dt>
                <dd className="mt-1">9:00 AM-6:00 PM</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">WhatsApp</dt>
                <dd className="mt-1">
                  <a className="font-semibold text-brand-green hover:underline" href={whatsappHref}>
                    +62 811-1201-0160
                  </a>
                </dd>
              </div>
            </dl>
          </section>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Delivery areas",
              body: "Selected Jabodetabek and Bandung areas are supported. Exact availability depends on the destination and delivery timing.",
            },
            {
              title: "Same-day availability",
              body: "Same-day delivery may be possible in selected areas when stock, preparation time, and courier timing allow.",
            },
            {
              title: "Delivery fee",
              body: "Delivery fee is confirmed through WhatsApp after Tiny Bitty reviews your area, order size, and preferred schedule.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-lg border border-line bg-surface-raised p-5">
              <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-normal text-ink">How delivery confirmation works</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              {
                title: "Share your area",
                body: "Send your destination area and preferred delivery date through WhatsApp.",
              },
              {
                title: "Confirm availability",
                body: "Tiny Bitty checks stock, preparation timing, and delivery feasibility.",
              },
              {
                title: "Review the fee",
                body: "Delivery fee and schedule are confirmed before the order is final.",
              },
              {
                title: "Finalize order",
                body: "Payment details are shared after the items, timing, and delivery plan are clear.",
              },
            ].map((step, index) => (
              <li key={step.title} className="rounded-lg border border-line bg-surface-raised p-4">
                <p className="text-sm font-semibold text-brand-green">Step {index + 1}</p>
                <h3 className="mt-2 font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 rounded-lg border border-dashed border-line bg-surface-muted p-5">
          <h2 className="text-xl font-semibold text-ink">Large and corporate orders</h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Bulk, gift box, and corporate orders may require extra planning time. Share the
            quantity, packaging needs, and delivery schedule so Tiny Bitty can confirm production
            and delivery details before the quotation is finalized.
          </p>
        </section>
      </Container>
    </main>
  );
}
