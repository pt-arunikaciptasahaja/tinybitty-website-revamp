import { describe, expect, it } from "vitest";
import { generateMetadata as generateBundleMetadata } from "@/app/bundles/[slug]/page";
import { generateMetadata as generateCookieMetadata } from "@/app/cookies/[slug]/page";

describe("route SEO metadata", () => {
  it("does not expose placeholder product SEO metadata", async () => {
    const metadata = await generateCookieMetadata({
      params: Promise.resolve({ slug: "placeholder-cookie-product" }),
    });

    expect(metadata.title).toBe("Cookie Product Details");
    expect(metadata.description).toBe(
      "Review Tiny Bitty cookie product details and prepare a WhatsApp enquiry.",
    );
    expect(JSON.stringify(metadata)).not.toContain("[OWNER_INPUT_REQUIRED]");
    expect(JSON.stringify(metadata)).not.toContain("noindex");
  });

  it("does not expose placeholder bundle SEO metadata", async () => {
    const metadata = await generateBundleMetadata({
      params: Promise.resolve({ slug: "placeholder-bundle" }),
    });

    expect(metadata.title).toBe("Bundle Details");
    expect(metadata.description).toBe(
      "Review Tiny Bitty bundle details and prepare a WhatsApp enquiry.",
    );
    expect(JSON.stringify(metadata)).not.toContain("[OWNER_INPUT_REQUIRED]");
    expect(JSON.stringify(metadata)).not.toContain("noindex");
  });
});
