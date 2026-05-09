import Link from "next/link";
import { Package } from "lucide-react";

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.55C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.23 0z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.84l-5.36-7-6.13 7H1.42l8.02-9.16L1 2h7l4.84 6.4L18.24 2zm-1.2 18h1.83L7.06 4H5.1l11.94 16z" />
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.56v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.68.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

type FooterLink = { label: string; href: string };

const columns: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Categories",
    links: [
      { label: "FBA Prep", href: "/category/fba-prep-services" },
      { label: "DTC Fulfillment", href: "/category/dtc-fulfillment" },
      { label: "Cold Storage", href: "/category/cold-storage" },
      { label: "B2B Freight", href: "/category/b2b-freight" },
      { label: "Returns", href: "/category/returns-management" },
      { label: "Kitting", href: "/category/kitting-and-assembly" },
    ],
  },
  {
    heading: "Locations",
    links: [
      { label: "United States", href: "/location/usa" },
      { label: "Canada", href: "/location/canada" },
      { label: "United Kingdom", href: "/location/uk" },
      { label: "California", href: "/location/usa/california" },
      { label: "Texas", href: "/location/usa/texas" },
      { label: "Ontario", href: "/location/canada/ontario" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "How it works", href: "#" },
      { label: "3PL Buyer's Guide", href: "#" },
      { label: "Compare partners", href: "#" },
      { label: "Pricing benchmarks", href: "#" },
      { label: "Case studies", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Press", href: "#" },
      { label: "Partner program", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Vetting standards", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-soft bg-surface" aria-label="Footer">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6 md:gap-8">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-navy"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-navy text-white">
                <Package className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                Prep Parcel
              </span>
            </Link>
            <p className="mt-4 max-w-[200px] text-[13px] leading-[1.6] text-text-2">
              The vetted directory of 3PL warehouses and fulfillment partners.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-3">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="text-[14px] text-text-2 transition-colors duration-200 hover:text-navy"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-[14px] text-text-2 transition-colors duration-200 hover:text-navy"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-border-soft pt-8 md:flex-row md:items-center">
          <p className="text-[13px] text-text-3">
            &copy; {new Date().getFullYear()} Prep Parcel Partners. An{" "}
            <span className="font-medium text-text-2">AMZ Prep</span> company.
          </p>
          <div className="flex items-center gap-2">
            {[
              { Icon: LinkedInIcon, label: "LinkedIn" },
              { Icon: XIcon, label: "X" },
              { Icon: GithubIcon, label: "GitHub" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-soft text-text-2 transition-all duration-200 hover:border-blue hover:text-blue"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
