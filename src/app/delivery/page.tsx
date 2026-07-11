import type { Metadata } from "next";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.delivery);

export default function DeliveryPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-brand-green">
      <h1 className="text-3xl font-bold">Delivery</h1>
      <p className="mt-3 text-brand-green/75">
        Approved delivery zones, cut-off, fee policy, pickup rules, and large-order rules are
        required.
      </p>
    </main>
  );
}
