import type { SiteConfig } from "@/content/schemas";
import { validateSiteConfig } from "@/content/validation";

export const siteConfig = {
  name: "Tiny Bitty",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://tinybitty.shop",
  description: "Sweet treats made to bring people closer.",
  announcement: {
    enabled: true,
    text: "Same-day delivery is available in selected areas — confirm availability via WhatsApp.",
    href: "/delivery",
    linkLabel: "Delivery info",
  },
  footerNote: "Stock, delivery fee, delivery schedule, and payment are confirmed through WhatsApp.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281112010160",
  instagramUrl: "https://www.instagram.com/tiny.bitty/",
  logo: {
    label: "Tiny Bitty",
    imageSrc: "",
  },
  navigation: [
    { href: "/cookies", label: "Cookies" },
    { href: "/bundles", label: "Bundles" },
    { href: "/corporate-gifts", label: "Corporate Gifts" },
    { href: "/about", label: "Our Story" },
    { href: "/cart", label: "Cart" },
  ],
  footerNavigation: [
    { href: "/delivery", label: "Delivery" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
  stickyCta: {
    label: "Order via WhatsApp",
    href: "/contact",
  },
} satisfies SiteConfig;

validateSiteConfig(siteConfig);
