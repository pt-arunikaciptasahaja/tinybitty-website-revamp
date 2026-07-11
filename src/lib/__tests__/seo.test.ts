import { describe, expect, it } from "vitest";
import { PLACEHOLDER_NOTICE, type FAQ } from "@/content/schemas";
import {
  assertProductionMetadata,
  buildMetadata,
  faqQualifiesForStructuredData,
  routeSeo,
  staticRouteSeo,
} from "@/lib/seo";

describe("SEO utilities", () => {
  it("builds canonical Open Graph metadata", () => {
    expect(buildMetadata(routeSeo.cookies)).toMatchObject({
      title: "Cookies",
      description: "Browse Tiny Bitty cookie products and prepare a WhatsApp enquiry.",
      alternates: { canonical: "/cookies" },
      openGraph: {
        url: "/cookies",
        images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        images: ["/opengraph-image"],
      },
    });
  });

  it("rejects placeholder production metadata", () => {
    expect(() => assertProductionMetadata(staticRouteSeo)).not.toThrow();
    expect(() =>
      assertProductionMetadata([
        {
          path: "/bad",
          title: "[OWNER_INPUT_REQUIRED]",
          description: "placeholder description",
        },
      ]),
    ).toThrow("invalid production SEO metadata");
  });

  it("gates FAQ structured data to approved visible questions", () => {
    expect(
      faqQualifiesForStructuredData({
        contentStatus: "placeholder",
        placeholderNotice: PLACEHOLDER_NOTICE,
        id: "placeholder",
        question: "[OWNER_INPUT_REQUIRED]",
        answer: "[OWNER_INPUT_REQUIRED]",
        category: "ordering",
      }),
    ).toBe(false);

    expect(
      faqQualifiesForStructuredData({
        contentStatus: "approved",
        id: "approved",
        question: "How do I order?",
        answer: "Send an enquiry through WhatsApp.",
        category: "ordering",
      } satisfies FAQ),
    ).toBe(true);
  });
});
