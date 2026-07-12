import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const whatsappHref =
  buildWhatsAppUrl(
    siteConfig.whatsappNumber,
    "Halo Tiny Bitty, saya ingin bertanya tentang menu dan pemesanan.",
  ) ?? "/contact";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface-raised pb-20 text-sm text-ink-muted md:pb-0">
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr]">
          <section className="max-w-md">
            <Logo />
            <p className="mt-4 leading-6">
              Homemade cookies and gift-ready treats for everyday orders, sharing moments, and
              corporate occasions.
            </p>
            <p className="mt-3 text-xs leading-5">{siteConfig.footerNote}</p>
          </section>

          <section>
            <h2 className="font-semibold text-ink">Order and contact</h2>
            <dl className="mt-4 grid gap-3">
              <div>
                <dt className="font-semibold text-ink-muted">Business hours</dt>
                <dd className="mt-1 leading-6">
                  Mon-Sat: 8:00 AM-8:00 PM
                  <br />
                  Sunday: 9:00 AM-6:00 PM
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink-muted">WhatsApp orders</dt>
                <dd className="mt-1">
                  <a className="font-semibold text-brand-green hover:underline" href={whatsappHref}>
                    +62 811-1201-0160
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink-muted">Delivery areas</dt>
                <dd className="mt-1 leading-6">
                  Selected Jabodetabek and Bandung areas. Availability, timing, and fees are
                  confirmed via WhatsApp.
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="font-semibold text-ink">Follow and order</h2>
            <div className="mt-4 grid gap-3">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-green hover:underline"
              >
                @tiny.bitty on Instagram
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-green hover:underline"
              >
                Order via WhatsApp
              </a>
              <p className="text-xs leading-5">
                Same-day delivery may be available in selected areas. Custom and corporate orders
                are confirmed by enquiry.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-5 border-t border-line pt-5 md:grid-cols-[1fr_auto] md:items-center">
          <p className="text-xs">© {year} Tiny Bitty. All rights reserved.</p>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {siteConfig.footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs font-semibold text-ink-muted hover:text-ink hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
