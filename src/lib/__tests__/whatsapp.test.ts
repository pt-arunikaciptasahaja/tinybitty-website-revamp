import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

describe("WhatsApp utilities", () => {
  it("builds the required confirmation-oriented message", () => {
    const message = buildWhatsAppMessage({
      orderId: "TB-123456",
      customer: {
        customerName: "Owner Input",
        fulfillmentMethod: "delivery",
        area: "Jakarta",
        desiredDate: "2026-07-11",
        timeWindow: "10:00-12:00",
      },
      subtotal: 25000,
      items: [
        {
          label: "Cookie",
          detail: "Small",
          quantity: 1,
          unitPrice: 25000,
          subtotal: 25000,
        },
      ],
    });

    expect(message).toContain("Order ID: TB-123456");
    expect(message).toContain("Pilihan: Delivery");
    expect(message).toContain("Waktu: 10:00-12:00");
    expect(message).toContain("stok, delivery fee, jadwal, dan pembayaran masih perlu konfirmasi");
    expect(message).not.toContain("purchase complete");
  });

  it("URL-encodes messages safely", () => {
    const url = buildWhatsAppUrl("6281112010160", "Halo Tiny Bitty & thanks");

    expect(url).toBe("https://wa.me/6281112010160?text=Halo%20Tiny%20Bitty%20%26%20thanks");
  });

  it("returns null when WhatsApp is not configured", () => {
    expect(buildWhatsAppUrl("[OWNER_INPUT_REQUIRED]", "Halo")).toBeNull();
    expect(buildWhatsAppUrl("", "Halo")).toBeNull();
  });
});
