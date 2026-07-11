import type { CorporatePackage } from "@/content/schemas";
import { validateCorporatePackages } from "@/content/validation";

const corporatePackageFixtures = [
  {
    contentStatus: "approved",
    id: "starter-gift-box",
    slug: "starter-gift-box",
    name: "Starter Gift Box",
    description: "A simple corporate gift option for teams, clients, and office treats.",
    includedItems: ["Golden Crunch cookies", "Heavenly Bites cookies", "A complimentary gift note"],
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
    includedItems: ["Golden Crunch cookies", "Harvest Haven cookies", "Custom packaging"],
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
    includedItems: ["Custom cookie selection", "Bulk quantity planning", "Delivery coordination"],
    leadTime: "1 week notice for larger orders",
    customizationOptions: ["Quantity", "Delivery schedule", "Custom message card"],
    status: "active",
  },
] satisfies CorporatePackage[];

export const corporatePackages = validateCorporatePackages(corporatePackageFixtures);
