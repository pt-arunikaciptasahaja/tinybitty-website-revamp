import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BundleAnalytics } from "@/features/bundles/BundleAnalytics";
import { trackEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", async () => {
  const actual = await vi.importActual<typeof import("@/lib/analytics")>("@/lib/analytics");

  return {
    ...actual,
    trackEvent: vi.fn(),
  };
});

describe("BundleAnalytics", () => {
  it("tracks bundle list views", () => {
    render(
      <BundleAnalytics
        source="test-bundles"
        items={[{ item_id: "bundle", item_name: "Bundle", item_category: "bundle" }]}
      />,
    );

    expect(trackEvent).toHaveBeenCalledWith("view_item_list", {
      source: "test-bundles",
      currency: "IDR",
      items: [{ item_id: "bundle", item_name: "Bundle", item_category: "bundle" }],
    });
  });

  it("tracks bundle detail views", () => {
    render(
      <BundleAnalytics
        eventName="view_item"
        source="bundle_detail"
        items={[{ item_id: "bundle", item_name: "Bundle", item_category: "bundle" }]}
      />,
    );

    expect(trackEvent).toHaveBeenCalledWith("view_item", {
      source: "bundle_detail",
      currency: "IDR",
      items: [{ item_id: "bundle", item_name: "Bundle", item_category: "bundle" }],
    });
  });
});
