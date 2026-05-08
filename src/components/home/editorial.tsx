import { ShieldCheck, MessageSquareQuote, Handshake } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Partners",
    body: "Every 3PL is vetted on operational capacity, certifications, and references before they're listed. No pay-to-play rankings.",
  },
  {
    icon: MessageSquareQuote,
    title: "Authentic Reviews",
    body: "Reviews come from verified eCommerce operators only — tied to a real shipment volume, not anonymous traffic.",
  },
  {
    icon: Handshake,
    title: "Direct Connections",
    body: "Reach decision-makers, not sales teams. Schedule intros, request quotes, and onboard without the runaround.",
  },
];

export function Editorial() {
  return (
    <section className="section bg-surface" aria-labelledby="editorial-heading">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <header className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-blue">
            Why Prep Parcel
          </p>
          <h2
            id="editorial-heading"
            className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-text md:text-[44px]"
          >
            Why brands choose Prep Parcel Partners.
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-navy">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-text">
                {title}
              </h3>
              <p className="mt-3 text-[16px] leading-[1.65] text-text-2">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
