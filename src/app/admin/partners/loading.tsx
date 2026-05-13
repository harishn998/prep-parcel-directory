import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function PartnersLoading() {
  return (
    <div className="px-6 py-8">
      <AdminPageHeader
        title="Partners"
        description="Manage partner profiles, visibility, and verification status."
      />

      <div className="mt-6 h-11 w-full animate-pulse rounded-md bg-[var(--surface)]" />

      <div className="mt-6 overflow-hidden rounded-md border border-[var(--border)] bg-white">
        <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--border)]" />
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <li
              key={i}
              className="flex items-center gap-4 px-4 py-4"
              aria-hidden="true"
            >
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-md bg-[var(--surface)]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-[var(--surface)]" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-[var(--surface)]" />
              </div>
              <div className="hidden h-6 w-20 animate-pulse rounded-full bg-[var(--surface)] md:block" />
              <div className="hidden h-6 w-16 animate-pulse rounded bg-[var(--surface)] md:block" />
              <div className="h-8 w-8 animate-pulse rounded bg-[var(--surface)]" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
