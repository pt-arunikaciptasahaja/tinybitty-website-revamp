import { describe, expect, it } from "vitest";
import {
  buildCorporateWhatsAppMessage,
  validateCorporateEnquiry,
} from "@/features/corporate/corporate-enquiry";

describe("corporate enquiry validation", () => {
  it("accepts valid enquiries", () => {
    const result = validateCorporateEnquiry({
      companyName: "Acme",
      contactName: "Ayu",
      email: "ayu@example.com",
      phone: "6281112010160",
      packageSlug: "placeholder-corporate-package-starter",
      estimatedQuantity: "24",
      desiredDate: "2026-08-01",
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
      phone: "6281112010160",
      packageSlug: "placeholder-corporate-package-starter",
      estimatedQuantity: "24",
      desiredDate: "2026-08-01",
      website: "https://spam.example",
    });

    expect(spamResult.success).toBe(false);
  });

  it("builds a confirmation-oriented WhatsApp message", () => {
    const message = buildCorporateWhatsAppMessage({
      companyName: "Acme",
      contactName: "Ayu",
      email: "ayu@example.com",
      phone: "6281112010160",
      packageSlug: "placeholder-corporate-package-starter",
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
