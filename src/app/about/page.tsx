import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.about);

const behindTheScenesPhotos = [
  {
    src: "https://res.cloudinary.com/dodmwwp1w/image/upload/v1783779238/ChatGPT_Image_Jul_11_2026_09_13_30_PM_ztvbzc.png",
    alt: "the process of cookie preparation",
  },
  {
    src: "https://res.cloudinary.com/dodmwwp1w/image/upload/v1783778987/ChatGPT_Image_Jul_11_2026_09_07_21_PM_3_fuwrfv.png",
    alt: "mixing cookies ingredients",
  },
  {
    src: "https://res.cloudinary.com/dodmwwp1w/image/upload/v1783778986/ChatGPT_Image_Jul_11_2026_09_07_21_PM_1_npz5zo.png",
    alt: "goes to the oven for baking",
  },
  {
    src: "https://res.cloudinary.com/dodmwwp1w/image/upload/v1783778985/ChatGPT_Image_Jul_11_2026_09_07_21_PM_2_botht0.png",
    alt: "the oven where magic happens",
  },
  {
    src: "https://res.cloudinary.com/dodmwwp1w/image/upload/v1783781310/ChatGPT_Image_Jul_11_2026_09_43_59_PM_urdeub.png",
    alt: "where cookie sits at the cooling tray waiting for packaging",
  },
  {
    src: "https://res.cloudinary.com/dodmwwp1w/image/upload/v1783781311/ChatGPT_Image_Jul_11_2026_09_47_42_PM_a8ottt.png",
    alt: "cookie ready to ship",
  },
];

const storyDetails = [
  "Ingredients prepared with care before every batch",
  "Recipes refined for texture, sweetness, and balance",
  "Cookies baked in small batches for sharing and gifting",
];

export default function AboutPage() {
  return (
    <main className="bg-surface">
      <Container className="py-10 sm:py-14 lg:py-16">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
              Our Story
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-normal text-ink sm:text-5xl">
              Where Our Story Comes to Life
            </h1>
            <p className="mt-5 text-base leading-7 text-ink-muted sm:text-lg sm:leading-8">
              Step behind the scenes and discover the journey behind every Tiny Bitty cookie, from
              carefully preparing each ingredient and perfecting every recipe to baking each batch
              with the same attention, warmth, and passion that have guided us since the very
              beginning.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-ink-muted">
              {storyDetails.map((detail) => (
                <p key={detail} className="rounded-lg border border-line bg-surface-raised p-4">
                  {detail}
                </p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {behindTheScenesPhotos.map((photo, index) => (
              <figure
                key={photo.src}
                className={index === 0 ? "sm:col-span-2 lg:col-span-1" : undefined}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-surface-muted shadow-soft sm:aspect-[4/3]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </figure>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
