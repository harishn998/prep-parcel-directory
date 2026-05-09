import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  breadcrumb,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: string;
  breadcrumb: BreadcrumbItem[];
}) {
  return (
    <header className="border-b border-border-soft bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-10 md:px-8 md:pt-16 md:pb-12">
        <Breadcrumb items={breadcrumb} />
        <div className="mt-6">
          {eyebrow && (
            <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-blue">
              {eyebrow}
            </p>
          )}
          <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-text md:text-[44px]">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-[16px] leading-[1.65] text-text-2 md:text-[17px]">
              {description}
            </p>
          )}
          {meta && (
            <p className="mt-4 text-[13px] font-medium text-text-3">{meta}</p>
          )}
        </div>
      </div>
    </header>
  );
}
