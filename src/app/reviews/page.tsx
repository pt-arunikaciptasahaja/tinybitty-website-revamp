import type { Metadata } from "next";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.reviews);

export default function ReviewsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-brand-green">
      <h1 className="text-3xl font-bold">Reviews</h1>
      <p className="mt-3 text-brand-green/75">
        Verified review text, source labels, and permissions are required.
      </p>
    </main>
  );
}
