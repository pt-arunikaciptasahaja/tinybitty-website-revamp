import { describe, expect, it } from "vitest";
import { generateMetadata as generateBundleMetadata } from "@/app/bundles/[slug]/page";
import { generateMetadata as generateCookieMetadata } from "@/app/cookies/[slug]/page";

describe("route SEO metadata", () => {
  it("does not expose placeholder product SEO metadata", async () => {
    const metadata = await generateCookieMetadata({
      params: Promise.resolve({ slug: "golden-crunch" }),
    });

    expect(metadata.title).toBe("Golden Crunch | Tiny Bitty Cookies");
    expect(metadata.description).toBe(
      "Discover Golden Crunch, a buttery cookie with sliced almonds, chocolate chips, and crisp cornflakes.",
    );
    expect(JSON.stringify(metadata)).not.toContain("[OWNER_INPUT_REQUIRED]");
    expect(JSON.stringify(metadata)).not.toContain("noindex");
  });

  it("does not expose placeholder bundle SEO metadata", async () => {
    const metadata = await generateBundleMetadata({
      params: Promise.resolve({ slug: "sweet-sharing-bundle" }),
    });

    expect(metadata.title).toBe("Sweet Sharing Mini Bundle | Tiny Bitty");
    expect(metadata.description).toBe(
      "Order a Mini 30gr Sweet Sharing Bundle with Tiny Bitty cookies for gifting or office treats.",
    );
    expect(JSON.stringify(metadata)).not.toContain("[OWNER_INPUT_REQUIRED]");
    expect(JSON.stringify(metadata)).not.toContain("noindex");
  });
});
