import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import Link from "next/link";
import { juiceLaunchImage, juiceProducts, juiceVolumeLabel } from "@/content/juices";

export function JuiceLaunchImage({ priority = false }: { priority?: boolean }) {
  return (
    <Image
      {...juiceLaunchImage}
      alt={juiceLaunchImage.alt}
      priority={priority}
      sizes="(max-width: 767px) 100vw, 60vw"
      className="juice-launch-image"
    />
  );
}

export function JuiceCollection() {
  return (
    <div className="juice-grid">
      {juiceProducts.map((juice, index) => (
        <article key={juice.id} className="cookie-card">
          <Link href={"/juices/" + juice.slug} tabIndex={-1} aria-hidden="true">
            <Image
              {...juice.image}
              alt={juice.image.alt}
              sizes="(max-width: 639px) 85vw, (max-width: 1023px) 40vw, 20vw"
              className="juice-card__image cookie-card__image"
            />
          </Link>
          <div className="cookie-card__body">
            <p className="cookie-card__index">{String(index + 1).padStart(2, "0")}</p>
            <h3>{juice.name}</h3>
            <p className="cookie-card__description">{juice.description}</p>
            <p className="cookie-card__price">
              {juiceVolumeLabel(juice)} &middot;{" "}
              {juice.pricing.amount === null ? (
                "Ask for price"
              ) : (
                <Price amount={juice.pricing.amount} />
              )}
            </p>
            <Button
              href={"/juices/" + juice.slug}
              variant="ghost"
              className="cookie-card__link"
              aria-label={"Enquire about " + juice.name}
            >
              View details <span className="cta-arrow" aria-hidden="true">&rarr;</span>
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
