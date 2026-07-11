import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CheckoutForm } from "@/features/checkout/CheckoutForm";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.cart);

export default function CartPage() {
  return (
    <main>
      <Container className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="Cart"
          title="WhatsApp checkout"
          description="Review your items, add enquiry details, and open a pre-filled WhatsApp message for confirmation."
        />
        <div className="mt-8">
          <CheckoutForm />
        </div>
      </Container>
    </main>
  );
}
