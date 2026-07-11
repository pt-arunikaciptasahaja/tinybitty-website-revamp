import type { FAQ } from "@/content/schemas";
import { validateFaqs } from "@/content/validation";

const faqFixtures = [
  {
    contentStatus: "approved",
    id: "ordering-faq",
    question: "How do I place an order?",
    answer:
      "Browse the cookie catalogue, choose your preferred size and sweetness option, and send your order via WhatsApp for confirmation and payment details.",
    category: "ordering",
  },
  {
    contentStatus: "approved",
    id: "delivery-faq",
    question: "What areas do you deliver to?",
    answer:
      "Delivery is available in selected Jabodetabek and Bandung areas, with same-day options depending on location and timing.",
    category: "delivery",
  },
  {
    contentStatus: "approved",
    id: "products-faq",
    question: "How fresh are your cookies?",
    answer:
      "Tiny Bitty cookies are baked fresh and are best enjoyed within three months when stored in an airtight container.",
    category: "products",
  },
  {
    contentStatus: "approved",
    id: "corporate-faq",
    question: "Do you offer corporate gifting?",
    answer:
      "Yes. We can arrange gift boxes and bulk orders for offices, events, and celebrations with custom delivery timing and packaging support.",
    category: "corporate",
  },
] satisfies FAQ[];

export const faqs = validateFaqs(faqFixtures);
