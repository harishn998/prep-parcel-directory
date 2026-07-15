import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Profile loading skeleton — mirrors the real /directory/[slug] structure
 * (hero → tabs bar → 8/4 content grid) so real content replaces it with zero
 * layout shift.
 */
export default function PartnerProfileLoading() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <div className="border-b border-border-soft bg-surface">
          <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-10 md:px-8 md:pt-16">
            <Skeleton className="h-3 w-48" />
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-2/3 max-w-md" />
                <Skeleton className="h-4 w-1/2 max-w-lg" />
                <div className="flex gap-3">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs bar */}
        <div className="border-b border-border-soft bg-surface">
          <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-8 px-6 md:px-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
        </div>

        {/* Content grid: 8 main / 4 sidebar */}
        <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-24 md:px-8 md:pt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-12 lg:col-span-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>

            <aside className="space-y-5 lg:col-span-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="space-y-3 rounded-xl border border-border-soft bg-surface p-6"
                >
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              ))}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
