import type { Metadata } from "next";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.contact);

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-brand-green">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-3 text-brand-green/75">
        Approved email, business hours, pickup location, and public business details are required.
      </p>
    </main>
  );
}
