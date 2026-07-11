import type { FAQ } from "@/content/schemas";
import { JsonLd } from "@/features/seo/JsonLd";
import { faqQualifiesForStructuredData } from "@/lib/seo";

type FaqJsonLdProps = {
  faqs: FAQ[];
};

export function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  const qualifiedFaqs = faqs.filter(faqQualifiesForStructuredData);

  if (qualifiedFaqs.length === 0) {
    return null;
  }

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: qualifiedFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}
