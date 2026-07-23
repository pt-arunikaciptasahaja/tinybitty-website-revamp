"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site-config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useCart } from "@/features/cart/CartProvider";

export function Header() {
  const { itemCount } = useCart();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const updateHeader = () => {
      setIsCompact(window.scrollY > 48);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateHeader);
    };
  }, []);

  return (
    <header
      className="site-header sticky top-0 z-50 border-b border-line bg-surface-raised/95 backdrop-blur"
      data-compact={isCompact ? "true" : "false"}
    >
      <AnnouncementBar />
      <Container className="site-header__inner relative flex min-h-16 items-center justify-between gap-4 py-3">
        <Logo />
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="site-nav-link rounded-pill px-3 py-2 text-sm font-semibold text-ink-muted hover:bg-surface-muted hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {itemCount > 0 ? (
            <Link
              href="/cart"
              aria-label={`Cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
              className="site-nav-link relative rounded-pill p-2 text-ink-muted hover:bg-surface-muted hover:text-ink"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="m2.05 2.05 2.2 2.2 2.55 10.54a2 2 0 0 0 1.94 1.51h9.85a2 2 0 0 0 1.93-1.4l1.85-7.18a1 1 0 0 0-.95-1.27H5.83" />
              </svg>
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-xs font-semibold text-white">
                {itemCount}
              </span>
            </Link>
          ) : null}
          <div className="hidden md:block">
            <Button href={siteConfig.stickyCta.href} size="sm">
              {siteConfig.stickyCta.label}
            </Button>
          </div>
          <MobileMenu items={siteConfig.navigation} />
        </div>
      </Container>
    </header>
  );
}
