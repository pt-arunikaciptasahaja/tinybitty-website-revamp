import type { FAQ } from "@/content/schemas";
import { corporateMoqCopy } from "@/content/corporate-packages";
import { validateFaqs } from "@/content/validation";

const faqFixtures = [
  {
    contentStatus: "approved",
    id: "ordering-how-to-order",
    question: "How do I place an order?",
    answer:
      "Browse the cookie catalogue, choose the cookie size and sweetness option when available, then continue through WhatsApp. Tiny Bitty will confirm stock, delivery fee, schedule, and payment details before the order is final.",
    category: "ordering",
  },
  {
    contentStatus: "approved",
    id: "ordering-payment",
    question: "What payment methods are available?",
    answer:
      "Payment details are shared after your order is confirmed through WhatsApp. The final amount may include product total, delivery fee, and any approved packaging or corporate order details.",
    category: "ordering",
  },
  {
    contentStatus: "approved",
    id: "ordering-change-cancel",
    question: "Can I change or cancel my order?",
    answer:
      "Please contact Tiny Bitty on WhatsApp as soon as possible. Changes and cancellations can only be reviewed before preparation, packing, or delivery arrangements have started.",
    category: "ordering",
  },
  {
    contentStatus: "approved",
    id: "products-cookie-options",
    question: "What cookie flavours are available?",
    answer:
      "The current catalogue includes Golden Crunch, Heavenly Bites, Harvest Haven, and the seasonal Desert Crown. Availability may change, so stock is always confirmed through WhatsApp before payment.",
    category: "products",
  },
  {
    contentStatus: "approved",
    id: "products-sizes",
    question: "What cookie sizes can I order?",
    answer:
      "Most cookies are available in Mini 30gr, Small 100gr, Medium 150gr, and Large 400gr sizes. You can review the available size options on each product page before sending your enquiry.",
    category: "products",
  },
  {
    contentStatus: "approved",
    id: "products-sweetness",
    question: "Do you offer normal sugar and less sugar cookies?",
    answer:
      "Selected cookies can be prepared in normal sugar or less sugar. Normal sugar gives a fuller classic cookie sweetness, while less sugar keeps the texture and ingredient flavours more forward.",
    category: "products",
  },
  {
    contentStatus: "approved",
    id: "products-ingredients",
    question: "What ingredients are used in the cookies?",
    answer:
      "Tiny Bitty cookies are made with ingredients such as flour, eggs, Australian butter, brown sugar, chocolate chips, almonds, oats, raisins, cornflakes, and other flavour-specific additions listed on each product page.",
    category: "products",
  },
  {
    contentStatus: "approved",
    id: "products-allergens",
    question: "Do the cookies contain allergens?",
    answer:
      "Yes. Current cookie recipes may contain gluten, eggs, milk, and for selected flavours, tree nuts. Please review the allergen notes on each product page and confirm with Tiny Bitty before ordering if you have a specific allergy concern.",
    category: "products",
  },
  {
    contentStatus: "approved",
    id: "storage-shelf-life",
    question: "How long do the cookies last?",
    answer:
      "Tiny Bitty cookies are best enjoyed within 3 months when stored properly in an airtight container. For the best texture, keep them sealed when not serving.",
    category: "products",
  },
  {
    contentStatus: "approved",
    id: "storage-how-to-store",
    question: "How should I store the cookies?",
    answer:
      "Store cookies in a cool, dry place away from direct sunlight. Use an airtight container after opening to help preserve texture and flavour.",
    category: "products",
  },
  {
    contentStatus: "approved",
    id: "delivery-areas",
    question: "What areas do you deliver to?",
    answer:
      "Tiny Bitty delivers to selected Jabodetabek and Bandung areas. Exact delivery availability depends on your destination, order timing, stock, and schedule, so please confirm through WhatsApp before checkout.",
    category: "delivery",
  },
  {
    contentStatus: "approved",
    id: "delivery-same-day",
    question: "Is same-day delivery available?",
    answer:
      "Same-day delivery may be available in selected areas when stock, preparation time, and courier timing allow. Availability and delivery fee are confirmed through WhatsApp.",
    category: "delivery",
  },
  {
    contentStatus: "approved",
    id: "delivery-fee",
    question: "How much does delivery cost?",
    answer:
      "Delivery fee is confirmed after Tiny Bitty reviews your destination area, order size, and preferred schedule. The fee is shared before payment so the order total is clear.",
    category: "delivery",
  },
  {
    contentStatus: "approved",
    id: "corporate-gifting",
    question: "Do you offer corporate gifting?",
    answer:
      "Yes. Tiny Bitty prepares cookie gifts for meetings, seminars, grand openings, client visits, internal events, and company celebrations. Share your event details so the package, quantity, timing, and delivery can be reviewed.",
    category: "corporate",
  },
  {
    contentStatus: "approved",
    id: "corporate-moq",
    question: "What is the minimum order for corporate gifts?",
    answer: `${corporateMoqCopy}. Larger or custom orders may need extra planning time depending on quantity, packaging, and delivery schedule.`,
    category: "corporate",
  },
  {
    contentStatus: "approved",
    id: "corporate-customization",
    question: "Can corporate packages include custom packaging?",
    answer:
      "Corporate orders may include greeting cards, message cards, premium packaging, ribbons, sleeves, stickers, or corporate logo options depending on the package and availability. Final details are confirmed during quotation.",
    category: "corporate",
  },
  {
    contentStatus: "approved",
    id: "legal-final-confirmation",
    question: "When is my order considered final?",
    answer:
      "Your order is final only after Tiny Bitty confirms the items, quantity, delivery fee, schedule, and payment details through WhatsApp.",
    category: "legal",
  },
] satisfies FAQ[];

export const faqs = validateFaqs(faqFixtures);
