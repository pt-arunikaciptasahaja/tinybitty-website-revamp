import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "@/content";
import { SiteShell } from "@/components/layout/SiteShell";
import { siteConfig } from "@/content/site-config";
import { AnalyticsScripts } from "@/features/analytics/AnalyticsScripts";
import { OrganizationJsonLd } from "@/features/seo/OrganizationJsonLd";
import { routeSeo, SEO_IMAGE_PATH } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: routeSeo.home.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: routeSeo.home.description,
  icons: {
    icon: siteConfig.logo.imageSrc,
    apple: siteConfig.logo.imageSrc,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: routeSeo.home.title,
    description: routeSeo.home.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: SEO_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} catalogue preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: routeSeo.home.title,
    description: routeSeo.home.description,
    images: [SEO_IMAGE_PATH],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* This root layout is the App Router equivalent of a global document head. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Laila:wght@600;700&family=Montserrat:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <OrganizationJsonLd />
        <AnalyticsScripts />
        <Analytics />
        <SpeedInsights />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
