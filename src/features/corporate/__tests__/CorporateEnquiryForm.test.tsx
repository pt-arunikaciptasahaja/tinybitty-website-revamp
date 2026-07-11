import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { corporatePackages } from "@/content/corporate-packages";
import { CorporateEnquiryForm } from "@/features/corporate/CorporateEnquiryForm";
import { trackEvent } from "@/lib/analytics";

vi.mock("@/features/corporate/actions", async () => {
  const actual = await vi.importActual<typeof import("@/features/corporate/actions")>(
    "@/features/corporate/actions",
  );

  return {
    ...actual,
    submitCorporateEnquiry: vi.fn(),
  };
});

vi.mock("@/lib/analytics", async () => {
  const actual = await vi.importActual<typeof import("@/lib/analytics")>("@/lib/analytics");

  return {
    ...actual,
    trackEvent: vi.fn(),
  };
});

describe("CorporateEnquiryForm", () => {
  it("renders accessible required fields and missing WhatsApp fallback", () => {
    render(<CorporateEnquiryForm packages={corporatePackages} />);

    expect(screen.getByLabelText("Company name")).toBeRequired();
    expect(screen.getByLabelText("Contact name")).toBeRequired();
    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Phone or WhatsApp")).toBeRequired();
    expect(screen.getByLabelText("Package tier")).toBeRequired();
    expect(screen.getByLabelText("Estimated quantity")).toBeRequired();
    expect(screen.getByLabelText("Desired date")).toBeRequired();
    expect(screen.getByLabelText("Package tier")).toHaveAttribute("id", "corporate-packageSlug");
    expect(screen.getByLabelText("Notes")).toHaveAttribute("id", "corporate-notes");
    expect(screen.getByText(/WhatsApp alternative requires/i)).toBeInTheDocument();
    expect(trackEvent).not.toHaveBeenCalledWith("corporate_enquiry", expect.anything());
  });
});
