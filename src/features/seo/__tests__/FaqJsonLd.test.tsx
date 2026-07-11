import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PLACEHOLDER_NOTICE, type FAQ } from "@/content/schemas";
import { FaqJsonLd } from "@/features/seo/FaqJsonLd";

describe("FaqJsonLd", () => {
  it("does not render placeholder FAQs", () => {
    const { container } = render(
      <FaqJsonLd
        faqs={[
          {
            contentStatus: "placeholder",
            placeholderNotice: PLACEHOLDER_NOTICE,
            id: "placeholder",
            question: "[OWNER_INPUT_REQUIRED]",
            answer: "[OWNER_INPUT_REQUIRED]",
            category: "ordering",
          },
        ]}
      />,
    );

    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it("renders approved FAQ structured data", () => {
    const approvedFaq = {
      contentStatus: "approved",
      id: "approved",
      question: "How do I order?",
      answer: "Send an enquiry through WhatsApp.",
      category: "ordering",
    } satisfies FAQ;
    const { container } = render(<FaqJsonLd faqs={[approvedFaq]} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (!script) {
      throw new Error("Expected FAQ JSON-LD.");
    }

    const jsonLd = JSON.parse(script.textContent ?? "{}") as { "@type": string };

    expect(jsonLd["@type"]).toBe("FAQPage");
  });
});
