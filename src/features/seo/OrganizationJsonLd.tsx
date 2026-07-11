import { siteConfig } from "@/content/site-config";
import { JsonLd } from "@/features/seo/JsonLd";

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        sameAs: [siteConfig.instagramUrl],
      }}
    />
  );
}
