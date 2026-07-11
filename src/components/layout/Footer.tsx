import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-raised pb-20 text-sm text-ink-muted md:pb-0">
      <Container className="grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-start">
        <div className="max-w-md">
          <Logo />
          <p className="mt-4 leading-6">{siteConfig.footerNote}</p>
          <p className="mt-3 text-xs">Approved public business details: [OWNER_INPUT_REQUIRED]</p>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
            {siteConfig.footerNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-semibold text-ink-muted hover:text-ink hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
