"use client";

import { useEffect } from "react";
import type { AnalyticsItem } from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";

type CatalogAnalyticsProps = {
  source: string;
  items: AnalyticsItem[];
};

export function CatalogAnalytics({ source, items }: CatalogAnalyticsProps) {
  useEffect(() => {
    trackEvent("view_item_list", {
      source,
      currency: "IDR",
      items,
    });
  }, [items, source]);

  return null;
}
