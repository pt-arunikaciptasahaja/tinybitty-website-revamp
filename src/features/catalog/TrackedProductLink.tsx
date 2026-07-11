"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { AnalyticsItem } from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";

type TrackedProductLinkProps = {
  href: string;
  item: AnalyticsItem;
  children: ReactNode;
  className?: string;
};

export function TrackedProductLink({ href, item, children, className }: TrackedProductLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackEvent("select_item", {
          source: "cookie_catalogue",
          currency: "IDR",
          items: [item],
        })
      }
    >
      {children}
    </Link>
  );
}
