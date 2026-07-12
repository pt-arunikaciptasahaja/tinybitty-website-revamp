import Image from "next/image";
import type { Product } from "@/content/schemas";

type ProductImageProps = {
  product: Product;
  className?: string;
};

export function ProductImage({ product, className }: ProductImageProps) {
  const image = product.images[0];

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{
        aspectRatio: image ? `${image.width} / ${image.height}` : "4 / 3",
      }}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </div>
  );
}
