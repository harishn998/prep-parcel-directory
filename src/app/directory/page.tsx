import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DirectoryView } from "@/components/directory/directory-view";

export const metadata: Metadata = {
  title: "Browse 3PL & Fulfillment Partners — Prep Parcel Partners",
  description:
    "Browse 500+ vetted 3PL warehouses and fulfillment partners across the USA, Canada, and the UK. Filter by service, location, integrations, and more.",
};

export default function DirectoryPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DirectoryView />
      </main>
      <Footer />
    </>
  );
}
