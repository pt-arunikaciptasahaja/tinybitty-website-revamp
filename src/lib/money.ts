export function formatRupiah(amount: number): string {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error("Rupiah amount must be a non-negative integer.");
  }

  return `Rp${new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}
