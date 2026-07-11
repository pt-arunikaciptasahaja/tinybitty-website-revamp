"use client";

import { useEffect } from "react";
import type { AnalyticsItem } from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";

type ProductViewAnalyticsProps = {
  item: AnalyticsItem;
};

export function ProductViewAnalytics({ item }: ProductViewAnalyticsProps) {
  useEffect(() => {
    trackEvent("view_item", {
      source: "product_detail",
      currency: "IDR",
      items: [item],
    });
  }, [item]);

  return null;
}
