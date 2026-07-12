import type { CorporatePackage } from "@/content/schemas";
import { validateCorporatePackages } from "@/content/validation";

export const corporateMoqCopy =
  "MOQ: 50 pcs for Mini 30gr and Small 100gr, or 30 pcs for Medium 150gr and Large 400gr";

const corporatePackageFixtures = [
  {
    contentStatus: "approved",
    id: "starter-gift-box",
    slug: "starter-gift-box",
    name: "Starter Gift Box",
    description: "A simple corporate gift option for teams, clients, and office treats.",
    includedItems: [
      "Selected cookie variants",
      "Standard gift box or simple individual pack",
      "Greeting card or message card",
    ],
    leadTime: "2 days notice",
    customizationOptions: ["Flavor mix", "Gift note", "Delivery timing"],
    status: "active",
  },
  {
    contentStatus: "approved",
    id: "signature-gift-box",
    slug: "signature-gift-box",
    name: "Signature Gift Box",
    description: "A curated gift box for premium client appreciation and celebratory occasions.",
    includedItems: [
      "Curated cookie variant selection",
      "Greeting card or message card",
      "Premium packaging presentation",
      "Ribbon or finishing detail, subject to availability",
    ],
    leadTime: "3 days notice",
    customizationOptions: ["Flavor selection", "Packaging style", "Corporate branding"],
    status: "active",
  },
  {
    contentStatus: "approved",
    id: "custom-corporate-order",
    slug: "custom-corporate-order",
    name: "Custom Corporate Order",
    description: "A tailored corporate order for events, bulk gifting, or special celebrations.",
    includedItems: [
      "Custom cookie size and variant selection",
      "Greeting card or event message card",
      "Premium packaging with custom corporate logo option",
      "Ribbon, sleeve, sticker, or finishing detail options",
      "Bulk quantity and delivery coordination",
    ],
    leadTime: "1 week notice for larger orders",
    customizationOptions: ["Quantity", "Delivery schedule", "Custom message card"],
    status: "active",
  },
] satisfies CorporatePackage[];

export const corporatePackages = validateCorporatePackages(corporatePackageFixtures);
