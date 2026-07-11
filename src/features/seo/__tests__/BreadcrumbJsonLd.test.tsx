import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BreadcrumbJsonLd } from "@/features/seo/BreadcrumbJsonLd";

describe("BreadcrumbJsonLd", () => {
  it("renders breadcrumb structured data", () => {
    const { container } = render(
      <BreadcrumbJsonLd
        items={[
          { href: "/cookies", label: "Cookies" },
          { href: "/cookies/approved-cookie", label: "Approved Cookie" },
        ]}
      />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');

    if (!script) {
      throw new Error("Expected BreadcrumbList JSON-LD.");
    }

    const jsonLd = JSON.parse(script.textContent ?? "{}") as {
      itemListElement: Array<{ position: number; name: string; item: string }>;
    };

    expect(jsonLd.itemListElement).toHaveLength(3);
    expect(jsonLd.itemListElement[0]).toMatchObject({ position: 1, name: "Home" });
    expect(jsonLd.itemListElement[2]?.item).toBe("https://tinybitty.shop/cookies/approved-cookie");
  });
});
