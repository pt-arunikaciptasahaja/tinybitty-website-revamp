import type { Product } from "@/content/schemas";

type ProductImageProps = {
  product: Product;
  className?: string;
};

export function ProductImage({ product, className }: ProductImageProps) {
  const image = product.images[0];

  return (
    <div
      role="img"
      aria-label={image?.alt ?? product.name}
      className={className}
      style={{
        aspectRatio: image ? `${image.width} / ${image.height}` : "4 / 3",
      }}
    />
  );
}
