import type { Metadata } from "next";
import { HomePageSections } from "@/components/home/HomePageSections";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(routeSeo.home);

export default function HomePage() {
  return <HomePageSections />;
}
