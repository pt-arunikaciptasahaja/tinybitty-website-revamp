import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import { Container } from "@/components/ui/Container";

export function AnnouncementBar() {
  const { announcement } = siteConfig;

  if (!announcement.enabled) {
    return null;
  }

  return (
    <div
      className="border-b border-line bg-brand-lime/25 text-sm text-ink"
      role="region"
      aria-label="Site announcement"
    >
      <Container className="flex min-h-10 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center">
        <span>{announcement.text}</span>
        <Link href={announcement.href} className="font-semibold text-brand-green underline">
          {announcement.linkLabel}
        </Link>
      </Container>
    </div>
  );
}
