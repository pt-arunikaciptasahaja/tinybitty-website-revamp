import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

describe("WhatsAppButton", () => {
  it("links to WhatsApp when the WhatsApp number is configured", () => {
    render(<WhatsAppButton label="Ask on WhatsApp" />);

    expect(screen.getByRole("link", { name: "Ask on WhatsApp" })).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    );
  });
});
