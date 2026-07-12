import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const helpfulLinks = [
  {
    href: "/cookies",
    title: "Browse cookies",
    body: "See current flavours, sizes, prices, sweetness options, and product details.",
  },
  {
    href: "/bundles",
    title: "Explore bundles",
    body: "Compare ready-to-share cookie bundles for gifts, office treats, and gatherings.",
  },
  {
    href: "/corporate-gifts",
    title: "Corporate gifts",
    body: "Plan cookie gifts for meetings, events, client visits, and company celebrations.",
  },
  {
    href: "/faq",
    title: "Read FAQ",
    body: "Find answers about ordering, delivery, storage, allergens, and payment confirmation.",
  },
];

export default function NotFound() {
  const whatsappHref =
    buildWhatsAppUrl(
      siteConfig.whatsappNumber,
      "Halo Tiny Bitty, saya membuka link yang tidak ditemukan. Bisa bantu arahkan?",
    ) ?? "/contact";

  return (
    <main className="min-h-[70vh] bg-surface">
      <Container className="py-14 sm:py-20">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
              404 - Page not found
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink sm:text-5xl">
              This Tiny Bitty page is not available
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
              The link may be outdated, mistyped, or moved during the website revamp. You can head
              back to the main catalogue, check delivery and FAQ details, or ask us on WhatsApp for
              help finding the right page.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/">Back to home</Button>
              <Button href={whatsappHref} target="_blank" rel="noopener noreferrer" variant="outline">
                Ask via WhatsApp
              </Button>
            </div>
          </div>

          <aside className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
            <h2 className="text-xl font-semibold text-ink">Where to go next</h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted">
              Try one of these pages if you were looking for cookies, delivery information, or a
              corporate order.
            </p>
            <div className="mt-5 grid gap-3">
              {helpfulLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-line bg-surface p-4 transition-colors hover:bg-surface-muted"
                >
                  <span className="font-semibold text-ink">{item.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-ink-muted">{item.body}</span>
                </Link>
              ))}
            </div>
          </aside>
        </section>
      </Container>
    </main>
  );
}
