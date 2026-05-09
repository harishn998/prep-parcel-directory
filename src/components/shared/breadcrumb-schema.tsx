import { JsonLd } from "./json-ld";

export type BreadcrumbSchemaItem = { name: string; url: string };

/**
 * Emits BreadcrumbList JSON-LD for SEO. Pair with the visual <Breadcrumb>
 * component for the same item set.
 */
export function BreadcrumbSchema({ items }: { items: BreadcrumbSchemaItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
