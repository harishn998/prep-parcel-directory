import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/shared/cta-banner";
import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { TabOverview } from "@/components/profile/tab-overview";
import { TabServices } from "@/components/profile/tab-services";
import { TabIntegrations } from "@/components/profile/tab-integrations";
import { TabReviews } from "@/components/profile/tab-reviews";
import { TabLocations } from "@/components/profile/tab-locations";
import { QuickStatsCard } from "@/components/profile/quick-stats-card";
import { ContactCard } from "@/components/profile/contact-card";
import { SimilarPartners } from "@/components/profile/similar-partners";
import { QuoteFormCard } from "@/components/profile/quote-form-card";
import { CompareSection } from "@/components/profile/compare-section";
import {
  getAllPartnerSlugs,
  getPartnerBySlug,
  getSimilarPartners,
} from "@/lib/data/partners";

type RouteParams = { slug: string };

export async function generateStaticParams() {
  const slugs = await getAllPartnerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);
  if (!partner) {
    return {
      title: "Partner not found — Prep Parcel Partners",
    };
  }
  const title = `${partner.name} — 3PL Profile | Prep Parcel Partners`;
  const description = partner.tagline;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: "/og-placeholder.png",
          width: 1200,
          height: 630,
          alt: `${partner.name} on Prep Parcel Partners`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PartnerProfilePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);
  if (!partner) notFound();

  const similar = await getSimilarPartners(partner.slug, 3);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ProfileHero partner={partner} />
        <ProfileTabs />

        <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-24 md:px-8 md:pt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-20 lg:col-span-8">
              <TabOverview partner={partner} />
              <TabServices partner={partner} />
              <TabIntegrations partner={partner} />
              <TabReviews partner={partner} />
              <TabLocations partner={partner} />
            </div>

            <aside className="space-y-5 lg:col-span-4">
              <div className="lg:sticky lg:top-[152px] lg:space-y-5">
                <QuickStatsCard partner={partner} />
                <ContactCard partner={partner} />
                <SimilarPartners partners={similar} />
                <QuoteFormCard partnerName={partner.name} />
              </div>
            </aside>
          </div>
        </div>

        <CompareSection current={partner} similar={similar} />

        <CtaBanner
          eyebrow="Get in touch"
          heading={`Ready to talk to ${partner.name}?`}
          description="Send a quote request and the team will reach out within 24 hours. Free, no commitment."
          primaryLabel="Get Quote"
          secondaryLabel="Visit Website"
        />
      </main>
      <Footer />
    </>
  );
}
