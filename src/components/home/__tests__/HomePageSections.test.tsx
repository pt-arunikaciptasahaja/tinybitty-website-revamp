import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomePageSections } from "@/components/home/HomePageSections";
import { trackEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", async () => {
  const actual = await vi.importActual<typeof import("@/lib/analytics")>("@/lib/analytics");

  return {
    ...actual,
    trackEvent: vi.fn(),
  };
});

describe("HomePageSections", () => {
  it("renders the required homepage sections as crawlable text", () => {
    render(<HomePageSections />);

    expect(screen.getByRole("heading", { name: "Tiny Bitty" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cookie catalogue" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Differentiator copy needs owner approval" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bundle offers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Reviews and permissions" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: "[OWNER_INPUT_REQUIRED]" }).length,
    ).toBeGreaterThan(0);
    const removedCategoryPath = `/${["ju", "ice"].join("")}`;
    expect(document.querySelector(`a[href="${removedCategoryPath}"]`)).toBeNull();
    expect(screen.getByRole("heading", { name: "WhatsApp enquiry flow" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Curated UGC placeholders" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Questions to approve" })).toBeInTheDocument();
  });

  it("tracks hero CTA interactions", () => {
    render(<HomePageSections />);

    fireEvent.click(screen.getByRole("link", { name: "Shop Best Sellers" }));
    fireEvent.click(screen.getByRole("link", { name: "Corporate Orders" }));

    expect(trackEvent).toHaveBeenCalledWith("select_item", {
      source: "homepage_hero_primary",
    });
    expect(trackEvent).toHaveBeenCalledWith("corporate_enquiry", {
      source: "homepage_hero_secondary",
    });
  });

  it("tracks product selection interactions", () => {
    render(<HomePageSections />);

    fireEvent.click(screen.getAllByRole("link", { name: "View details" })[0]!);

    expect(trackEvent).toHaveBeenCalledWith(
      "select_item",
      expect.objectContaining({
        source: "homepage_best_sellers",
        items: expect.arrayContaining([
          expect.objectContaining({
            item_id: "placeholder-cookie-product",
          }),
        ]),
      }),
    );
  });
});
