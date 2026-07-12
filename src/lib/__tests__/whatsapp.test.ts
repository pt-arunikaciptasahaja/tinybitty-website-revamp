import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

describe("WhatsApp utilities", () => {
  it("builds the required confirmation-oriented message", () => {
    const message = buildWhatsAppMessage({
      orderId: "TB-123456",
      customer: {
        customerName: "Owner Input",
        mobileNumber: "081234567890",
        deliveryAddress: "Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan",
        desiredDate: "2026-07-11",
      },
      subtotal: 25000,
      deliveryFee: 25000,
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
    expect(message).toContain("No. HP: 081234567890");
    expect(message).toContain("Metode: Delivery");
    expect(message).toContain("Alamat: Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan");
    expect(message).toContain("Delivery service: Flat delivery - Rp25.000");
    expect(message).toContain("Total pembayaran: Rp50.000");
    expect(message).toContain("Pembayaran via bank transfer:");
    expect(message).toContain("Luckyta Aryandini");
    expect(message).toContain("A/C BCA 1281458294");
    expect(message).not.toContain("Waktu:");
    expect(message).toContain(
      "Saya siap melanjutkan pembayaran setelah Tiny Bitty mengonfirmasi stok dan jadwal pengiriman.",
    );
    expect(message).not.toContain("purchase complete");
  });

  it("URL-encodes messages safely", () => {
    const url = buildWhatsAppUrl("6281112010160", "Halo Tiny Bitty & thanks");

    expect(url).toBe("https://wa.me/6281112010160?text=Halo%20Tiny%20Bitty%20%26%20thanks");
  });

  it("keeps customer-entered fields on a single safe line", () => {
    const message = buildWhatsAppMessage({
      orderId: "TB-123456",
      customer: {
        customerName: "Owner\nInput",
        mobileNumber: "081234567890",
        deliveryAddress: "Jl. Melati No. 12\nJakarta Selatan",
        desiredDate: "2026-07-11",
        notes: "Please deliver\nbefore lunch.",
      },
      subtotal: 25000,
      deliveryFee: 25000,
      items: [
        {
          label: "Cookie",
          quantity: 1,
          unitPrice: 25000,
          subtotal: 25000,
        },
      ],
    });

    expect(message).toContain("Nama: Owner Input");
    expect(message).toContain("Alamat: Jl. Melati No. 12 Jakarta Selatan");
    expect(message).toContain("Catatan: Please deliver before lunch.");
  });

  it("returns null when WhatsApp is not configured", () => {
    expect(buildWhatsAppUrl("[OWNER_INPUT_REQUIRED]", "Halo")).toBeNull();
    expect(buildWhatsAppUrl("", "Halo")).toBeNull();
  });
});
