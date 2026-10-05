import Image from "next/image";
import { Price } from "@/components/ui/Price";
import { notFound } from "next/navigation";
import { juiceProducts, juiceVolumeLabel } from "@/content/juices";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/features/catalog/Breadcrumbs";
import { AddJuiceToCartForm } from "@/features/juices/AddJuiceToCartForm";
import { buildMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return juiceProducts.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const juice = juiceProducts.find((item) => item.slug === slug);
  if (!juice) notFound();
  return buildMetadata({
    path: "/juices/" + slug,
    title: juice.name + " | Tiny Bitty Juice",
    description:
      "Enquire about " +
      juice.name +
      ". Final product details, price, availability, and delivery are confirmed through WhatsApp.",
  });
}
export default async function JuiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const juice = juiceProducts.find((item) => item.slug === slug);
  if (!juice) notFound();
  return (
    <main>
      <Container className="py-12 sm:py-16">
        <Breadcrumbs
          items={[
            { href: "/juices", label: "Juices" },
            { href: "/juices/" + juice.slug, label: juice.name },
          ]}
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <figure>
            <Image
              {...juice.image}
              alt={juice.image.alt}
              priority
              sizes="(max-width: 1023px) 90vw, 45vw"
              className="juice-detail-image"
            />
            <figcaption className="mt-3 text-sm text-ink-muted">
              {juice.name}. Final product details confirmed on WhatsApp.
            </figcaption>
          </figure>
          <div className="grid gap-5">
            <p className="home-kicker">Juice - Enquiry only</p>
            <h1 className="text-4xl font-bold">{juice.name}</h1>
            <p>{juice.description}</p>
            <p>{juiceVolumeLabel(juice)}</p>
            <p className="text-xl font-semibold">
              {juice.pricing.amount === null ? (
                "Ask for price"
              ) : (
                <Price amount={juice.pricing.amount} />
              )}
            </p>
            {juice.ingredients ? (
              <section aria-labelledby="juice-ingredients">
                <h2 id="juice-ingredients" className="font-semibold">
                  Ingredients
                </h2>
                <p className="mt-2 text-sm leading-6">{juice.ingredients.join(", ")}</p>
              </section>
            ) : null}
            <AddJuiceToCartForm juice={juice} />
            <section className="rounded-lg border border-line p-4">
              <h2 className="font-semibold">Before you order</h2>
              <p className="mt-2 text-sm leading-6">
                {juice.ingredients
                  ? "Allergens, shelf life, and storage requirements are awaiting"
                  : "Ingredients, allergens, shelf life, and storage requirements are awaiting"}
                confirmation. Please ask Tiny Bitty about dietary requirements before ordering.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
