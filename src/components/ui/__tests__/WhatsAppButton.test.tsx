import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

describe("WhatsAppButton", () => {
  it("falls back to contact when WhatsApp number is not configured", () => {
    render(<WhatsAppButton label="Ask on WhatsApp" />);

    expect(screen.getByRole("link", { name: "Ask on WhatsApp" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
