import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { BrowseCategories } from "@/components/home/browse-categories";
import { BrowseLocations } from "@/components/home/browse-locations";
import { FeaturedPartners } from "@/components/home/featured-partners";
import { StatsStrip } from "@/components/home/stats-strip";
import { Editorial } from "@/components/home/editorial";
import { CtaBanner } from "@/components/shared/cta-banner";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <BrowseCategories />
        <BrowseLocations />
        <FeaturedPartners />
        <StatsStrip />
        <Editorial />
        <CtaBanner
          eyebrow="For 3PL operators"
          heading="List your 3PL on the largest verified directory."
          description="Get in front of qualified eCommerce brands looking for their next fulfillment partner. Free to list, paid plans for premium placement."
          primaryLabel="List Your 3PL"
          secondaryLabel="Talk to us"
        />
      </main>
      <Footer />
    </>
  );
}
