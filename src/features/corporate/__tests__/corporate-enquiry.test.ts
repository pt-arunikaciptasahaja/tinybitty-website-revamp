import { describe, expect, it } from "vitest";
import {
  buildCorporateWhatsAppMessage,
  validateCorporateEnquiry,
} from "@/features/corporate/corporate-enquiry";

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

describe("corporate enquiry validation", () => {
  it("accepts valid enquiries", () => {
    const result = validateCorporateEnquiry({
      companyName: "Acme",
      contactName: "Ayu",
      email: "ayu@example.com",
      phone: "081112010160",
      packageSlug: "starter-gift-box",
      estimatedQuantity: "24",
      desiredDate: formatDateInputValue(addDays(new Date(), 1)),
      customization: "Ribbon",
      notes: "For event guests",
      website: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid fields and honeypot submissions", () => {
    const invalidResult = validateCorporateEnquiry({
      companyName: "",
      contactName: "",
      email: "not-email",
      phone: "",
      packageSlug: "",
      estimatedQuantity: "0",
      desiredDate: "",
      website: "",
    });

    expect(invalidResult.success).toBe(false);

    const spamResult = validateCorporateEnquiry({
      companyName: "Acme",
      contactName: "Ayu",
      email: "ayu@example.com",
      phone: "081112010160",
      packageSlug: "starter-gift-box",
      estimatedQuantity: "24",
      desiredDate: formatDateInputValue(addDays(new Date(), 1)),
      website: "https://spam.example",
    });

    expect(spamResult.success).toBe(false);

    const pastDateResult = validateCorporateEnquiry({
      companyName: "Acme",
      contactName: "Ayu",
      email: "ayu@example.com",
      phone: "081112010160",
      packageSlug: "starter-gift-box",
      estimatedQuantity: "24",
      desiredDate: formatDateInputValue(addDays(new Date(), -1)),
      website: "",
    });

    expect(pastDateResult.success).toBe(false);
    if (!pastDateResult.success) {
      expect(pastDateResult.fieldErrors.desiredDate).toBe(
        "Choose a desired date from today onward.",
      );
    }
  });

  it("builds a confirmation-oriented WhatsApp message", () => {
    const message = buildCorporateWhatsAppMessage({
      companyName: "Acme",
      contactName: "Ayu",
      email: "ayu@example.com",
      phone: "081112010160",
      packageSlug: "starter-gift-box",
      estimatedQuantity: 24,
      desiredDate: "2026-08-01",
      customization: "Ribbon",
      notes: "For event guests",
      website: "",
    });

    expect(message).toContain("Perusahaan: Acme");
    expect(message).toContain("Estimasi jumlah: 24");
    expect(message).toContain("Mohon konfirmasi MOQ, lead time, stok");
  });
});
