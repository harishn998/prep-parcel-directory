/**
 * Editorial body container — typed prose for category/location/combo pages.
 * Renders nicely-spaced paragraphs and headings, max-w-prose container.
 */
export function EditorialContent({
  title,
  paragraphs,
  className,
}: {
  title?: string;
  paragraphs: readonly string[];
  className?: string;
}) {
  return (
    <section className={["max-w-3xl", className].filter(Boolean).join(" ")}>
      {title && (
        <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-text md:text-[28px]">
          {title}
        </h2>
      )}
      <div className={["space-y-5", title && "mt-5"].filter(Boolean).join(" ")}>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-[16px] leading-[1.7] text-text-2"
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
