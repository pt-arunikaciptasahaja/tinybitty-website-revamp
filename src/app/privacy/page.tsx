import type { Metadata } from "next";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.privacy);

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-brand-green">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-3 text-brand-green/75">
        Privacy contact and data-retention policy are required.
      </p>
    </main>
  );
}
