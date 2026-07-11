"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { AnalyticsItem } from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";

type TrackedBundleLinkProps = {
  href: string;
  item: AnalyticsItem;
  children: ReactNode;
  className?: string;
};

export function TrackedBundleLink({ href, item, children, className }: TrackedBundleLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackEvent("select_item", {
          source: "bundle_catalogue",
          currency: "IDR",
          items: [item],
        })
      }
    >
      {children}
    </Link>
  );
}
