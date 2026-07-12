import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);

  nextDate.setDate(date.getDate() + days);

  return nextDate;
}

describe("CorporateEnquiryForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders accessible required fields and configured WhatsApp fallback", () => {
    render(<CorporateEnquiryForm packages={corporatePackages} />);

    expect(screen.getByLabelText("Company name")).toBeRequired();
    expect(screen.getByLabelText("Contact name")).toBeRequired();
    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Phone or WhatsApp")).toBeRequired();
    expect(screen.getByLabelText("Package tier")).toBeRequired();
    expect(screen.getByLabelText("Estimated quantity")).toBeRequired();
    expect(screen.getByLabelText("Desired date")).toBeRequired();
    expect(screen.getByLabelText("Desired date")).toHaveAttribute(
      "min",
      formatDateInputValue(new Date()),
    );
    expect(screen.getByLabelText("Package tier")).toHaveAttribute("id", "corporate-packageSlug");
    expect(screen.getByLabelText("Notes")).toHaveAttribute("id", "corporate-notes");
    expect(screen.getByRole("button", { name: "Continue to WhatsApp" })).toBeInTheDocument();
    expect(trackEvent).not.toHaveBeenCalledWith("corporate_enquiry", expect.anything());
  });

  it("shows schema-backed errors for invalid email, phone, and quantity", () => {
    render(<CorporateEnquiryForm packages={corporatePackages} />);

    fireEvent.change(screen.getByLabelText("Company name"), { target: { value: "Acme" } });
    fireEvent.change(screen.getByLabelText("Contact name"), { target: { value: "Ayu" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "not-email" } });
    fireEvent.change(screen.getByLabelText("Phone or WhatsApp"), { target: { value: "081" } });
    fireEvent.change(screen.getByLabelText("Package tier"), {
      target: { value: "starter-gift-box" },
    });
    fireEvent.change(screen.getByLabelText("Estimated quantity"), { target: { value: "0" } });
    fireEvent.change(screen.getByLabelText("Desired date"), { target: { value: "2026-08-01" } });
    fireEvent.submit(screen.getByRole("button", { name: "Continue to WhatsApp" }).closest("form")!);

    expect(screen.getByRole("alert")).toHaveTextContent("Please review the highlighted fields.");
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription(
      "Enter a valid email address.",
    );
    expect(screen.getByLabelText("Phone or WhatsApp")).toHaveAccessibleDescription(
      "Mobile number must be at least 10 digits.",
    );
    expect(screen.getByLabelText("Estimated quantity")).toHaveAccessibleDescription(
      "Estimated quantity is required.",
    );
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("rejects desired dates before today", () => {
    render(<CorporateEnquiryForm packages={corporatePackages} />);

    fireEvent.change(screen.getByLabelText("Company name"), { target: { value: "Acme" } });
    fireEvent.change(screen.getByLabelText("Contact name"), { target: { value: "Ayu" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ayu@example.com" } });
    fireEvent.change(screen.getByLabelText("Phone or WhatsApp"), {
      target: { value: "081112010160" },
    });
    fireEvent.change(screen.getByLabelText("Package tier"), {
      target: { value: "starter-gift-box" },
    });
    fireEvent.change(screen.getByLabelText("Estimated quantity"), { target: { value: "500" } });
    fireEvent.change(screen.getByLabelText("Desired date"), {
      target: { value: formatDateInputValue(addDays(new Date(), -1)) },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Continue to WhatsApp" }).closest("form")!);

    expect(screen.getByLabelText("Desired date")).toHaveAccessibleDescription(
      "Choose a desired date from today onward.",
    );
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("opens WhatsApp with valid values and tracks only non-PII package metadata", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<CorporateEnquiryForm packages={corporatePackages} />);

    fireEvent.change(screen.getByLabelText("Company name"), { target: { value: "Acme" } });
    fireEvent.change(screen.getByLabelText("Contact name"), { target: { value: "Ayu" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ayu@example.com" } });
    fireEvent.change(screen.getByLabelText("Phone or WhatsApp"), {
      target: { value: "081112010160" },
    });
    fireEvent.change(screen.getByLabelText("Package tier"), {
      target: { value: "starter-gift-box" },
    });
    fireEvent.change(screen.getByLabelText("Estimated quantity"), { target: { value: "500" } });
    fireEvent.change(screen.getByLabelText("Desired date"), { target: { value: "2026-08-01" } });
    fireEvent.change(screen.getByLabelText("Customization request"), {
      target: { value: "Ribbon" },
    });
    fireEvent.change(screen.getByLabelText("Notes"), {
      target: { value: "For event guests" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Continue to WhatsApp" }).closest("form")!);

    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining("https://wa.me/"), "_blank");
    const openedUrl = openSpy.mock.calls[0]?.[0] ?? "";
    const decodedUrl = decodeURIComponent(String(openedUrl));

    expect(decodedUrl).toContain("Perusahaan: Acme");
    expect(decodedUrl).toContain("Email: ayu@example.com");
    expect(decodedUrl).toContain("No. WhatsApp/telepon: 081112010160");
    expect(decodedUrl).toContain("Estimasi jumlah: 500");
    expect(trackEvent).toHaveBeenCalledWith("corporate_enquiry", {
      source: "corporate_gifts_form",
      items: [
        {
          item_id: "starter-gift-box",
          item_name: "Starter Gift Box",
          item_category: "corporate_package",
          quantity: 500,
        },
      ],
    });
    expect(trackEvent).not.toHaveBeenCalledWith(
      "corporate_enquiry",
      expect.objectContaining({
        companyName: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
      }),
    );
    expect(screen.getByLabelText("Company name")).toHaveValue("");
    expect(screen.getByLabelText("Phone or WhatsApp")).toHaveValue("");
  });

  it("keeps estimated quantity digit-only without changing the amount", () => {
    render(<CorporateEnquiryForm packages={corporatePackages} />);

    fireEvent.change(screen.getByLabelText("Estimated quantity"), {
      target: { value: "500pcs" },
    });

    expect(screen.getByLabelText("Estimated quantity")).toHaveValue("500");
    expect(screen.getByLabelText("Estimated quantity")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Estimated quantity")).toHaveAttribute("inputMode", "numeric");
  });
});
