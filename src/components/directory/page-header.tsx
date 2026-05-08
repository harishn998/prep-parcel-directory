import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SortDropdown } from "./sort-dropdown";
import type { SortValue } from "@/lib/sample-data";

export function DirectoryPageHeader({
  total,
  visible,
  sort,
  onSortChange,
}: {
  total: number;
  visible: number;
  sort: SortValue;
  onSortChange: (value: SortValue) => void;
}) {
  return (
    <div className="border-b border-border-soft bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-10 md:px-8 md:pt-16 md:pb-12">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Directory" }]}
        />
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-[36px] font-semibold leading-[1.1] tracking-[-0.025em] text-text md:text-[44px]">
              Browse 3PL &amp; Fulfillment Partners
            </h1>
            <p className="mt-3 text-[16px] leading-[1.65] text-text-2 md:text-[17px]">
              500+ vetted warehouses across USA, Canada, and the UK. Filter by
              service, location, integrations, and more.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="text-[13px] text-text-2">
              Showing{" "}
              <span data-numeric className="font-medium text-text">
                {visible}
              </span>{" "}
              of{" "}
              <span data-numeric className="font-medium text-text">
                {total}
              </span>
              + partners
            </p>
            <SortDropdown value={sort} onChange={onSortChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
