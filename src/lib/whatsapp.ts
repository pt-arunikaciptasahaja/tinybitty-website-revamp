export type WhatsAppLineItem = {
  label: string;
  detail?: string;
  quantity: number;
  unitPrice: number | null;
  subtotal: number | null;
};

export type WhatsAppCheckoutDetails = {
  customerName: string;
  mobileNumber: string;
  deliveryAddress: string;
  desiredDate: string;
  notes?: string;
};

export type WhatsAppMessageInput = {
  orderId: string;
  customer: WhatsAppCheckoutDetails;
  items: WhatsAppLineItem[];
  subtotal: number;
  deliveryFee: number | null;
};

function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

function formatCustomerField(value: string | undefined): string {
  const formattedValue = (value ?? "")
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return formattedValue || "-";
}

export function buildWhatsAppMessage(input: WhatsAppMessageInput): string {
  const needsQuote =
    input.items.some((item) => item.unitPrice === null) || input.deliveryFee === null;
  const total = input.subtotal + (input.deliveryFee ?? 0);
  const itemLines = input.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.label}${item.detail ? ` - ${item.detail}` : ""} - Qty ${item.quantity} - ${item.unitPrice === null || item.subtotal === null ? "Ask for price" : `${formatRupiah(item.unitPrice)} each - ${formatRupiah(item.subtotal)}`}`,
    )
    .join("\n");

  return [
    "Halo Tiny Bitty, saya ingin memesan.",
    "",
    `Order ID: ${input.orderId}`,
    `Nama: ${formatCustomerField(input.customer.customerName)}`,
    `No. HP: ${formatCustomerField(input.customer.mobileNumber)}`,
    "Metode: Delivery",
    `Alamat: ${formatCustomerField(input.customer.deliveryAddress)}`,
    `Tanggal: ${formatCustomerField(input.customer.desiredDate)}`,
    "",
    "Pesanan:",
    itemLines,
    "",
    input.items.some((item) => item.unitPrice === null)
      ? input.items.some((item) => item.unitPrice !== null)
        ? `Known-price subtotal (excludes unpriced items): ${formatRupiah(input.subtotal)}`
        : "Subtotal: Awaiting quotation"
      : `Subtotal: ${formatRupiah(input.subtotal)}`,
    input.deliveryFee === null
      ? "Delivery: Confirm availability and fee via WhatsApp"
      : `Delivery service: Flat delivery - ${formatRupiah(input.deliveryFee)}`,
    needsQuote
      ? "Total pembayaran: Confirm through WhatsApp after quotation"
      : `Total pembayaran: ${formatRupiah(total)}`,
    "",
    "Pembayaran via bank transfer:",
    "Luckyta Aryandini",
    "A/C BCA 1281458294",
    `Catatan: ${formatCustomerField(input.customer.notes)}`,
    "",
    "Saya siap melanjutkan pembayaran setelah Tiny Bitty mengonfirmasi stok dan jadwal pengiriman.",
    "Mohon dibantu cek detail pesanan ini. Terima kasih.",
  ].join("\n");
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string | null {
  const normalizedPhoneNumber = phoneNumber.replace(/\D/g, "");

  if (!normalizedPhoneNumber || phoneNumber.includes("OWNER_INPUT_REQUIRED")) {
    return null;
  }

  return `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(message)}`;
}
