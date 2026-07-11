export type WhatsAppLineItem = {
  label: string;
  detail?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type FulfillmentMethod = "delivery" | "pickup";

export type WhatsAppCheckoutDetails = {
  customerName: string;
  fulfillmentMethod: FulfillmentMethod;
  area: string;
  desiredDate: string;
  timeWindow: string;
  notes?: string;
};

export type WhatsAppMessageInput = {
  orderId: string;
  customer: WhatsAppCheckoutDetails;
  items: WhatsAppLineItem[];
  subtotal: number;
};

function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export function buildWhatsAppMessage(input: WhatsAppMessageInput): string {
  const itemLines = input.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.label}${item.detail ? ` - ${item.detail}` : ""} - Qty ${item.quantity} - ${formatRupiah(item.unitPrice)} each - ${formatRupiah(item.subtotal)}`,
    )
    .join("\n");

  return [
    "Halo Tiny Bitty, saya ingin memesan.",
    "",
    `Order ID: ${input.orderId}`,
    `Nama: ${input.customer.customerName}`,
    `Pilihan: ${input.customer.fulfillmentMethod === "delivery" ? "Delivery" : "Pickup"}`,
    `Area: ${input.customer.area}`,
    `Tanggal: ${input.customer.desiredDate}`,
    `Waktu: ${input.customer.timeWindow}`,
    "",
    "Pesanan:",
    itemLines,
    "",
    `Subtotal: ${formatRupiah(input.subtotal)}`,
    `Catatan: ${input.customer.notes || "-"}`,
    "",
    "Saya paham stok, delivery fee, jadwal, dan pembayaran masih perlu konfirmasi dari Tiny Bitty.",
    "Mohon konfirmasi detail pesanan ini. Terima kasih.",
  ].join("\n");
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string | null {
  const normalizedPhoneNumber = phoneNumber.replace(/\D/g, "");

  if (!normalizedPhoneNumber || phoneNumber.includes("OWNER_INPUT_REQUIRED")) {
    return null;
  }

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(message)}`;
}
