import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/content/site-config";

export function Logo() {
  const hasLogoImage = Boolean(siteConfig.logo.imageSrc);

  return (
    <Link href="/" aria-label={siteConfig.logo.label} className="inline-flex items-center rounded-sm text-ink">
      {hasLogoImage ? (
        <Image
          src={siteConfig.logo.imageSrc}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 rounded-sm object-contain"
          priority
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid h-10 w-10 place-items-center rounded-sm bg-brand-pink/35 text-sm font-bold text-brand-green"
        >
          TB
        </span>
      )}
      <span className="sr-only">{siteConfig.logo.label}</span>
    </Link>
  );
}
