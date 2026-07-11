"use client";

import { useEffect } from "react";
import type { AnalyticsEventName, AnalyticsItem } from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";

type BundleAnalyticsProps = {
  source: string;
  items: AnalyticsItem[];
  eventName?: Extract<AnalyticsEventName, "view_item" | "view_item_list">;
};

export function BundleAnalytics({
  source,
  items,
  eventName = "view_item_list",
}: BundleAnalyticsProps) {
  useEffect(() => {
    trackEvent(eventName, {
      source,
      currency: "IDR",
      items,
    });
  }, [eventName, items, source]);

  return null;
}
