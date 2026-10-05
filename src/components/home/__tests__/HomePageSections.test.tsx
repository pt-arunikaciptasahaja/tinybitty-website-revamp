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
      screen.getByRole("heading", { name: "Little bites. Refreshing sips." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "How to order" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Start with a favorite." })).toBeInTheDocument();
    expect(
      screen.getAllByRole("img", {
        name: "Four Tiny Bitty juice bottles displayed together in the juice collection launch image",
      }),
    ).not.toHaveLength(0);
    expect(
      screen.getByRole("heading", { name: "Same cookie. Your sweetness." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bundle the good stuff." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sweet Sharing Mini Bundle" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sweet Sharing Small Bundle" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sweet Sharing Medium Bundle" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sweet Sharing Large Bundle" })).toBeInTheDocument();
    expect(screen.getAllByText("Save Rp5.000 from the normal total.")).toHaveLength(4);
    expect(
      screen.getByRole("heading", { name: "Customer notes, shared with care." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Daniella Mottoh")).toBeInTheDocument();
    expect(screen.getByText("UI/UX Manager")).toBeInTheDocument();
    expect(screen.getByText("Fajar")).toBeInTheDocument();
    expect(screen.getByText("Padel instructor")).toBeInTheDocument();
    expect(screen.getByText("Customer review pending approval")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Cookies that arrive ready for the occasion.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "MOQ: 50 pcs for Mini 30gr and Small 100gr, or 30 pcs for Medium 150gr and Large 400gr",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Meet your new favorite sip." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Three small steps. One helpful chat." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A closer look is coming." })).toBeInTheDocument();
    expect(screen.getAllByText("Coming soon")).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Questions? Start here." })).toBeInTheDocument();
  });

  it("tracks hero CTA interactions", () => {
    render(<HomePageSections />);

    fireEvent.click(screen.getByRole("link", { name: "Explore juices" }));
    fireEvent.click(screen.getByRole("link", { name: "Shop cookies" }));

    expect(trackEvent).toHaveBeenCalledWith("select_item", {
      source: "homepage_hero_primary",
    });
    expect(trackEvent).toHaveBeenCalledWith("select_item", {
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
