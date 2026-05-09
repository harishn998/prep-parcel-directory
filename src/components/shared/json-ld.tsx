/**
 * Renders a JSON-LD structured-data block. Server component.
 * Use for any schema.org markup (BreadcrumbList, FAQPage, LocalBusiness, etc).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
