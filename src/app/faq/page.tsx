import type { Metadata } from "next";
import { faqs } from "@/content/faqs";
import { FaqJsonLd } from "@/features/seo/FaqJsonLd";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.faq);

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-brand-green">
      <FaqJsonLd faqs={faqs} />
      <h1 className="text-3xl font-bold">FAQ</h1>
      <p className="mt-3 text-brand-green/75">
        FAQ answers for delivery, shelf life, storage, allergens, sweetness choices, corporate MOQ,
        customization, payment, and cancellation policy are required.
      </p>
    </main>
  );
}
