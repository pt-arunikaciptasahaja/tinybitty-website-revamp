import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/content/site-config";
import { MobileMenu } from "@/components/layout/MobileMenu";

describe("MobileMenu", () => {
  it("opens, moves focus into the menu, and closes from the menu button", async () => {
    render(<MobileMenu items={siteConfig.navigation} />);

    const button = screen.getByRole("button", { name: "Open navigation menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "Mobile navigation" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("link", { name: "Cookies" })).toHaveFocus());

    fireEvent.click(screen.getByRole("button", { name: "Close navigation menu" }));

    expect(screen.queryByRole("region", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("closes when a navigation link is selected", () => {
    render(<MobileMenu items={siteConfig.navigation} />);

    fireEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));
    fireEvent.click(screen.getByRole("link", { name: "Cookies" }));

    expect(screen.queryByRole("region", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("closes on Escape and restores focus to the menu button", async () => {
    render(<MobileMenu items={siteConfig.navigation} />);

    const button = screen.getByRole("button", { name: "Open navigation menu" });
    fireEvent.click(button);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("region", { name: "Mobile navigation" })).not.toBeInTheDocument();
    await waitFor(() => expect(button).toHaveFocus());
  });
});
