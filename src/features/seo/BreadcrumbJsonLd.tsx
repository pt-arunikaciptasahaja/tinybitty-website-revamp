import { JsonLd } from "@/features/seo/JsonLd";
import { buildAbsoluteUrl } from "@/lib/seo";

export type BreadcrumbJsonLdItem = {
  href: string;
  label: string;
};

type BreadcrumbJsonLdProps = {
  items: BreadcrumbJsonLdItem[];
};

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const itemListElement = [{ href: "/", label: "Home" }, ...items].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: buildAbsoluteUrl(item.href),
  }));

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
      }}
    />
  );
}
