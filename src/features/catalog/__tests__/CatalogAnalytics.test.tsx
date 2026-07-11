import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CatalogAnalytics } from "@/features/catalog/CatalogAnalytics";
import { ProductViewAnalytics } from "@/features/catalog/ProductViewAnalytics";
import { trackEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", async () => {
  const actual = await vi.importActual<typeof import("@/lib/analytics")>("@/lib/analytics");

  return {
    ...actual,
    trackEvent: vi.fn(),
  };
});

describe("catalog analytics", () => {
  it("tracks list views", () => {
    render(
      <CatalogAnalytics
        source="test-list"
        items={[{ item_id: "one", item_name: "One", item_category: "cookies" }]}
      />,
    );

    expect(trackEvent).toHaveBeenCalledWith("view_item_list", {
      source: "test-list",
      currency: "IDR",
      items: [{ item_id: "one", item_name: "One", item_category: "cookies" }],
    });
  });

  it("tracks item views", () => {
    render(
      <ProductViewAnalytics
        item={{ item_id: "one", item_name: "One", item_category: "cookies" }}
      />,
    );

    expect(trackEvent).toHaveBeenCalledWith("view_item", {
      source: "product_detail",
      currency: "IDR",
      items: [{ item_id: "one", item_name: "One", item_category: "cookies" }],
    });
  });
});
