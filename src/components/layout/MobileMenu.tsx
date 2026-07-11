"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/content/site-config";
import { Button } from "@/components/ui/Button";

type MobileMenuProps = {
  items: typeof siteConfig.navigation;
};

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusFrame = window.requestAnimationFrame(() => {
      firstLinkRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        window.requestAnimationFrame(() => {
          triggerRef.current?.focus();
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex min-h-11 items-center justify-center rounded-pill border border-line bg-surface-raised px-4 text-sm font-semibold text-ink"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="sr-only">{isOpen ? "Close navigation menu" : "Open navigation menu"}</span>
        <span aria-hidden="true">{isOpen ? "Close" : "Menu"}</span>
      </button>
      {isOpen ? (
        <div
          id={menuId}
          role="region"
          aria-label="Mobile navigation"
          className="absolute inset-x-[var(--space-page-x)] top-full z-40 mt-3 rounded-lg border border-line bg-surface-raised p-3 shadow-raised"
        >
          <nav aria-label="Mobile navigation">
            <ul className="grid gap-1">
              {items.map((item, index) => (
                <li key={item.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    className="block rounded-md px-3 py-3 text-sm font-semibold text-ink hover:bg-surface-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-3 border-t border-line pt-3">
            <Button href={siteConfig.stickyCta.href} className="w-full" size="md">
              {siteConfig.stickyCta.label}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
