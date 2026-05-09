import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "./json-ld";

export type FaqItem = { question: string; answer: string };

/**
 * FAQ section with a shadcn Accordion + emits FAQPage JSON-LD for SEO.
 */
export function FaqAccordion({
  faqs,
  title = "Frequently asked questions",
}: {
  faqs: FaqItem[];
  title?: string;
}) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section className="max-w-3xl">
      <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-text md:text-[28px]">
        {title}
      </h2>
      <Accordion
        defaultValue={[`faq-0`]}
        className="mt-6"
      >
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border-b border-border-soft last:border-b-0"
          >
            <AccordionTrigger className="py-5 text-left text-[16px] font-medium text-text hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-[15px] leading-[1.65] text-text-2">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }}
      />
    </section>
  );
}
