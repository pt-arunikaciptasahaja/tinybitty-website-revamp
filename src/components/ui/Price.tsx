import { formatRupiah } from "@/lib/money";

type PriceProps = {
  amount: number;
  label?: string;
};

export function Price({ amount, label }: PriceProps) {
  return (
    <span aria-label={label ? `${label}: ${formatRupiah(amount)}` : formatRupiah(amount)}>
      {formatRupiah(amount)}
    </span>
  );
}
