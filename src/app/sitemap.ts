import type { MetadataRoute } from "next";
import { bundles } from "@/content/bundles";
import { products } from "@/content/products";
import { buildAbsoluteUrl, staticRouteSeo } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = staticRouteSeo.map((route) => ({
    url: buildAbsoluteUrl(route.path),
    lastModified,
  }));
  const productRoutes = products
    .filter((product) => product.category === "cookies")
    .map((product) => ({
      url: buildAbsoluteUrl(`/cookies/${product.slug}`),
      lastModified,
    }));
  const bundleRoutes = bundles.map((bundle) => ({
    url: buildAbsoluteUrl(`/bundles/${bundle.slug}`),
    lastModified,
  }));

  return [...staticRoutes, ...productRoutes, ...bundleRoutes];
}
