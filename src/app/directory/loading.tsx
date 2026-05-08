import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { PartnerCardSkeleton } from "@/components/directory/partner-card-skeleton";

export default function DirectoryLoading() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="border-b border-border-soft bg-surface">
          <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-10 md:px-8 md:pt-16 md:pb-12">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="mt-6 h-10 w-2/3 max-w-xl" />
            <Skeleton className="mt-3 h-4 w-1/2 max-w-md" />
          </div>
        </div>
        <div className="mx-auto max-w-[1280px] px-6 pt-10 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
            <div className="hidden space-y-4 lg:block">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <PartnerCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
