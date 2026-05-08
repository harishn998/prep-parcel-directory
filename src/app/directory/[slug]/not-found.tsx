import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function PartnerNotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-32">
        <div className="flex max-w-md flex-col items-center text-center">
          <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-text-3">
            <SearchX className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-text">
            Partner not found
          </h1>
          <p className="mt-3 text-[16px] leading-[1.65] text-text-2">
            We couldn&rsquo;t find a partner at that URL. The slug may be
            misspelled or the partner may no longer be listed.
          </p>
          <Button
            render={<Link href="/directory" />}
            className="mt-8 h-11 bg-blue px-5 text-[14px] font-medium text-white hover:bg-blue-hover"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" strokeWidth={2} />
            Back to directory
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
