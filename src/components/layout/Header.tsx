import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface-raised/95 backdrop-blur">
      <AnnouncementBar />
      <Container className="relative flex min-h-16 items-center justify-between gap-4 py-3">
        <Logo />
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-pill px-3 py-2 text-sm font-semibold text-ink-muted transition-colors duration-base ease-smooth hover:bg-surface-muted hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button href={siteConfig.stickyCta.href} size="sm">
            {siteConfig.stickyCta.label}
          </Button>
        </div>
        <MobileMenu items={siteConfig.navigation} />
      </Container>
    </header>
  );
}
