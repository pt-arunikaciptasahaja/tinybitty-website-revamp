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

    expect(
      screen.getByLabelText(
        "Freshly baked cookies for sharing, gifting, family gatherings, office meetings, and corporate events.",
      ),
    ).toBeInTheDocument();
    const heroBackgrounds = Array.from(document.querySelectorAll("[aria-hidden='true']"))
      .map((element) => (element as HTMLElement).style.backgroundImage)
      .join(" ");
    expect(heroBackgrounds).toContain("ChatGPT_Image_Jul_11_2026_05_37_28_PM");
    expect(heroBackgrounds).toContain("ChatGPT_Image_Jul_11_2026_05_20_36_PM");
    expect(screen.getByText("Freshly baked cookies for")).toBeInTheDocument();
    expect(screen.getByText("corporate events")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cookie catalogue" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("img", { name: "Golden Crunch cookie with almonds and chocolate chips" }),
    ).not.toHaveLength(0);
    expect(screen.getByRole("heading", { name: "Choose your sweetness" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bundle offers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sweet Sharing Mini Bundle" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sweet Sharing Small Bundle" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sweet Sharing Medium Bundle" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sweet Sharing Large Bundle" })).toBeInTheDocument();
    expect(screen.getAllByText("Save Rp5.000 from the normal total.")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Reviews and permissions" })).toBeInTheDocument();
    expect(screen.getByText("Customer review pending approval")).toBeInTheDocument();
    expect(screen.getByText("Photo permission pending approval")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Cookie gifts for meetings, events, and client appreciation",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "MOQ: 50 pcs for Mini 30gr and Small 100gr, or 30 pcs for Medium 150gr and Large 400gr",
      ),
    ).toBeInTheDocument();
    const removedCategoryPath = `/${["ju", "ice"].join("")}`;
    expect(document.querySelector(`a[href="${removedCategoryPath}"]`)).toBeNull();
    expect(screen.getByRole("heading", { name: "WhatsApp enquiry flow" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Tiny Bitty moments, coming soon" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Coming soon")).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Questions before you order?" })).toBeInTheDocument();
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
            item_id: "almond-crunch",
          }),
        ]),
      }),
    );
  });
});
