import type { Metadata } from "next";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.about);

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-brand-green">
      <h1 className="text-3xl font-bold">Our Story</h1>
      <p className="mt-3 text-brand-green/75">
        Founder story, real production photos, and approved quality practices are required before
        this page is finalized.
      </p>
    </main>
  );
}
