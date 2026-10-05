import Link from "next/link";
import type { Product } from "@/content/schemas";
import { ProductImage } from "@/features/catalog/ProductImage";
import { JuiceLaunchImage } from "@/features/juices/JuiceCollection";

export function HeroCollectionVisual({ cookies }: { cookies: readonly Product[] }) {
  return (
    <div className="hero-collection" aria-label="Tiny Bitty juice and cookies">
      <div className="hero-collection__juice">
        <JuiceLaunchImage priority />
      </div>
      <div className="hero-collection__cookies">
        {cookies.map((product) => (
          <Link
            key={product.id}
            href={`/cookies/${product.slug}`}
            className="hero-collection__cookie"
            aria-label={`Explore ${product.name} cookies`}
          >
            <ProductImage product={product} className="hero-collection__cookie-image" />
            <span className="hero-collection__cookie-copy">
              <span className="hero-collection__eyebrow">From the cookie shelf</span>
              <span className="hero-collection__name">{product.name}</span>
              <span className="hero-collection__link">
                Explore cookies <span aria-hidden="true">&rarr;</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
