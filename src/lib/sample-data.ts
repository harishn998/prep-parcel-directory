export type CoverGradient = "navy-blue" | "navy-amber" | "blue-indigo";

export type Review = {
  reviewerName: string;
  reviewerCompany: string;
  date: string; // ISO 8601
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  verified: boolean;
  helpful: number;
};

export type WarehouseLocation = {
  city: string;
  address: string;
  sqft: number;
  hours: string;
  services: string[];
};

export type DetailedService = {
  name: string;
  description: string;
  included: boolean;
};

export type CountryName = "USA" | "Canada" | "UK";

export type Partner = {
  // Phase 1A core
  name: string;
  slug: string;
  location: string;
  rating: number;
  reviewCount: number;
  services: string[];
  verified: boolean;
  description: string;
  logoPlaceholder: string;

  // Phase 1B profile fields
  tagline: string;
  yearFounded: number;
  employeeCount: string;
  coverGradient: CoverGradient;
  countryCode: "US" | "CA" | "GB";
  region: string; // e.g. state or province for filtering
  specialties: string[];
  integrations: string[];
  certifications: string[];
  minimumOrderVolume: "none" | "100" | "500" | "1000";
  pricingModel: string;
  responseTime: string;
  fulfillmentSpeed: string;
  orderAccuracy: number; // percentage, e.g. 99.7
  yearsInBusiness: number;
  activeBrandsServed: number;
  contact: { phone: string; email: string; website: string };
  about: [string, string, string];
  detailedServices: DetailedService[];
  warehouses: WarehouseLocation[];
  reviews: Review[];
  ratingBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };

  // Phase 1C SEO architecture fields
  country: CountryName;
  state: string; // taxonomy state slug e.g. 'california'
  stateFullName: string; // 'California'
  city: string | null; // taxonomy city slug, or null when primary city is off-taxonomy
  cityFullName: string | null;
  servedStates: string[]; // includes primary state; states this partner can serve
  serviceCategories: string[]; // taxonomy category slugs the partner offers
};

export type Category = {
  name: string;
  slug: string;
  description: string;
  partnerCount: number;
  iconKey: CategoryIconKey;
};

export type CategoryIconKey =
  | "package"
  | "truck"
  | "snowflake"
  | "warehouse"
  | "rotate"
  | "boxes"
  | "globe"
  | "scale";

export type Location = {
  country: string;
  slug: string;
  flag: string;
  partnerCount: number;
  cities: number;
};

export type Stat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
};

// ---------------------------------------------------------------------------
// Partners (12)
// ---------------------------------------------------------------------------

export const partners: Partner[] = [
  {
    name: "Northstar Fulfillment",
    slug: "northstar-fulfillment",
    location: "Toronto, ON",
    rating: 4.9,
    reviewCount: 247,
    services: ["FBA Prep", "DTC Fulfillment", "Returns"],
    verified: true,
    description:
      "Premium FBA prep and DTC fulfillment for ambitious DTC brands shipping across North America. Same-day cutoffs and dedicated account managers.",
    logoPlaceholder: "NF",

    tagline: "Premium FBA prep and DTC fulfillment for North American brands.",
    yearFounded: 2014,
    employeeCount: "120–150",
    coverGradient: "navy-blue",
    countryCode: "CA",
    region: "Ontario",
    specialties: [
      "Apparel",
      "Premium Beauty",
      "Subscription Boxes",
      "Sustainable Brands",
    ],
    integrations: [
      "Shopify",
      "Amazon",
      "WooCommerce",
      "BigCommerce",
      "NetSuite",
      "ShipStation",
    ],
    certifications: ["ISO 9001", "SOC 2"],
    minimumOrderVolume: "100",
    pricingModel: "Per-pick + storage, no monthly minimums",
    responseTime: "Under 2 hours",
    fulfillmentSpeed: "Same-day cutoff at 4pm ET",
    orderAccuracy: 99.7,
    yearsInBusiness: 11,
    activeBrandsServed: 184,
    contact: {
      phone: "+1 (416) 555-0143",
      email: "hello@northstarfulfillment.com",
      website: "https://northstarfulfillment.example",
    },
    about: [
      "Northstar Fulfillment was founded in 2014 by two operators who'd built and sold a DTC apparel brand. They started Northstar because every 3PL they used as a brand owner missed the operational details that made fulfillment feel like a competitive advantage — accurate inventory, on-time inbound receiving, and clean reporting.",
      "Today, the team operates two flagship facilities in the Greater Toronto Area and partners with 184 active eCommerce brands. They specialize in premium DTC where unboxing experience matters: hand-finished packaging, verified case packs, and zero-tolerance pick accuracy. Same-day FBA prep is included on every plan.",
      "Northstar's account management model assigns one dedicated lead per brand — the same person you onboard with stays on your account at scale. Reporting flows into Shopify, Amazon Seller Central, and a custom inventory dashboard updated every 15 minutes. Inbound receiving SLAs are 24 hours from dock to availability, even during peak.",
    ],
    detailedServices: [
      {
        name: "DTC Pick & Pack",
        description:
          "Standard pick-and-pack with branded inserts, configurable packaging, and per-SKU instructions.",
        included: true,
      },
      {
        name: "FBA Prep & Inbound",
        description:
          "FNSKU labeling, polybagging, bundling, case packing, and direct injection into Amazon FCs.",
        included: true,
      },
      {
        name: "Returns Processing",
        description:
          "Inspection, restocking, and disposition reporting with photo documentation per return.",
        included: true,
      },
      {
        name: "Kitting & Assembly",
        description:
          "Custom assembly for subscription boxes, bundles, and seasonal promotions.",
        included: false,
      },
      {
        name: "International Shipping",
        description:
          "DDP and DDU options to the US and EU with IOSS and customs documentation handled.",
        included: false,
      },
      {
        name: "Branded Tracking Pages",
        description:
          "Custom-branded tracking pages with email notifications powered by your domain.",
        included: false,
      },
    ],
    warehouses: [
      {
        city: "Toronto, ON",
        address: "1840 Matheson Blvd E, Mississauga, ON L4W 0B5",
        sqft: 86000,
        hours: "Mon–Fri 7am–7pm, Sat 8am–2pm ET",
        services: ["DTC Fulfillment", "FBA Prep", "Returns", "Kitting"],
      },
      {
        city: "Hamilton, ON",
        address: "210 Glover Rd, Hannon, ON L0R 1P0",
        sqft: 54000,
        hours: "Mon–Fri 6am–10pm ET",
        services: ["B2B Freight", "Cold-adjacent Storage", "Cross-Border"],
      },
    ],
    reviews: [
      {
        reviewerName: "Sarah Tran",
        reviewerCompany: "Daylit Skincare",
        date: "2026-03-14",
        rating: 5,
        text:
          "We moved to Northstar after two failed 3PL transitions and the difference is night and day. Their inbound team caught a case-pack mismatch on our first PO that would have cost us a week of stockouts. Pick accuracy has been 99.9% across 14k orders.",
        verified: true,
        helpful: 38,
      },
      {
        reviewerName: "Devon McAllister",
        reviewerCompany: "Wildwood Coffee",
        date: "2026-02-22",
        rating: 5,
        text:
          "Same-day FBA prep is the unlock for us — we keep less inventory at FCs and rely on Northstar to flow it through quickly. Account manager replies within an hour, even during Q4.",
        verified: true,
        helpful: 24,
      },
      {
        reviewerName: "Priya Anand",
        reviewerCompany: "Fold & Flora",
        date: "2026-02-08",
        rating: 5,
        text:
          "Beautiful packaging consistency across thousands of orders. Our customer service tickets about packing dropped to almost zero after we moved.",
        verified: true,
        helpful: 19,
      },
      {
        reviewerName: "Marcus Lee",
        reviewerCompany: "Northbound Outdoors",
        date: "2026-01-19",
        rating: 4,
        text:
          "Strong operationally. Wish their dashboard supported more granular SKU velocity reports — we end up exporting CSVs. Otherwise excellent.",
        verified: true,
        helpful: 11,
      },
      {
        reviewerName: "Jordan Reyes",
        reviewerCompany: "Halcyon Living",
        date: "2025-12-04",
        rating: 5,
        text:
          "Onboarding was the smoothest part of our entire DTC stack rebuild. Inventory was live and shipping in 11 days.",
        verified: true,
        helpful: 17,
      },
      {
        reviewerName: "Eliza Park",
        reviewerCompany: "Ember Pet Co.",
        date: "2025-11-12",
        rating: 5,
        text:
          "Returns reporting alone justifies the price. We finally have visibility into why people return things, with photos on every disposition.",
        verified: true,
        helpful: 14,
      },
      {
        reviewerName: "Tomás Ortega",
        reviewerCompany: "Casa Linea",
        date: "2025-10-08",
        rating: 4,
        text:
          "Pricing isn't the cheapest, but you get what you pay for. International shipping is a bit limited — we use a separate partner for EU.",
        verified: true,
        helpful: 9,
      },
      {
        reviewerName: "Hannah Brooks",
        reviewerCompany: "Saltgrove Apparel",
        date: "2025-09-22",
        rating: 5,
        text:
          "Best 3PL we've used in seven years of DTC. Period.",
        verified: true,
        helpful: 28,
      },
      {
        reviewerName: "Wei Chen",
        reviewerCompany: "Lumen Optics",
        date: "2025-08-30",
        rating: 5,
        text:
          "They handle our subscription kits, FBA prep, and returns under one roof and we save 4 vendor relationships in the process.",
        verified: true,
        helpful: 13,
      },
    ],
    ratingBreakdown: { 5: 195, 4: 38, 3: 9, 2: 3, 1: 2 },

    country: "Canada",
    state: "ontario",
    stateFullName: "Ontario",
    city: "toronto",
    cityFullName: "Toronto",
    servedStates: ["ontario"],
    serviceCategories: ["fba-prep-services", "dtc-fulfillment", "returns-management", "kitting-and-assembly"],
  },
  {
    name: "Meridian Logistics",
    slug: "meridian-logistics",
    location: "Dallas, TX",
    rating: 4.8,
    reviewCount: 189,
    services: ["B2B Freight", "Kitting", "Cold Storage"],
    verified: true,
    description:
      "Enterprise-grade 3PL with 12 distribution centers across the US. Specialists in complex kitting and temperature-controlled freight.",
    logoPlaceholder: "ML",

    tagline: "Enterprise fulfillment with cold-chain and complex kitting.",
    yearFounded: 2008,
    employeeCount: "500–750",
    coverGradient: "navy-amber",
    countryCode: "US",
    region: "Texas",
    specialties: ["Food & Beverage", "Health & Wellness", "Big-Box Retail"],
    integrations: ["NetSuite", "Shopify", "Amazon", "BigCommerce", "Magento"],
    certifications: ["ISO 9001", "FDA Registered", "SOC 2", "GMP"],
    minimumOrderVolume: "1000",
    pricingModel: "Custom per-program quotes",
    responseTime: "Under 4 hours",
    fulfillmentSpeed: "Same-day cutoff 3pm CT",
    orderAccuracy: 99.6,
    yearsInBusiness: 17,
    activeBrandsServed: 312,
    contact: {
      phone: "+1 (214) 555-0188",
      email: "partners@meridianlogistics.example",
      website: "https://meridianlogistics.example",
    },
    about: [
      "Meridian Logistics began in 2008 as a regional cold-chain operator serving Dallas-area food brands. Over 17 years they've grown into a national enterprise 3PL with 12 distribution centers across the continental US, all FDA-registered and GMP-audited.",
      "Their core specialty is complex programs that other 3PLs decline: temperature-controlled freight, multi-SKU subscription assembly, and retailer-compliant pallet shipping into Walmart, Target, Costco, and Whole Foods. Brands often arrive at Meridian after outgrowing a starter 3PL and needing infrastructure for retail expansion.",
      "Meridian operates dedicated account teams per program rather than per brand, and contracts include fully transparent open-book pricing on storage, handling, and freight. EDI integrations are deployed in roughly 4 weeks for new partners.",
    ],
    detailedServices: [
      {
        name: "Cold & Frozen Storage",
        description:
          "Refrigerated (35–55°F) and frozen (–10°F) warehousing with temperature logging.",
        included: true,
      },
      {
        name: "B2B Retail Compliance",
        description:
          "Routing guides, EDI, ASN, and case-conformance pack for major US retailers.",
        included: true,
      },
      {
        name: "Complex Kitting",
        description:
          "Multi-SKU assembly, gift sets, and subscription box building at scale.",
        included: true,
      },
      {
        name: "DTC Pick & Pack",
        description:
          "DTC parcel fulfillment with returns and branded packaging support.",
        included: true,
      },
      {
        name: "Cross-Dock & Drayage",
        description:
          "Container drayage from Houston and Long Beach, plus flow-through cross-dock.",
        included: false,
      },
    ],
    warehouses: [
      {
        city: "Dallas, TX",
        address: "5400 Bickers St, Dallas, TX 75212",
        sqft: 240000,
        hours: "24/7",
        services: ["Cold Storage", "B2B Freight", "Kitting"],
      },
      {
        city: "Atlanta, GA",
        address: "3850 Southside Industrial Pkwy, Atlanta, GA 30354",
        sqft: 180000,
        hours: "Mon–Sat 5am–11pm ET",
        services: ["DTC Fulfillment", "B2B Freight"],
      },
      {
        city: "Reno, NV",
        address: "1200 Golden Gate Dr, Sparks, NV 89431",
        sqft: 165000,
        hours: "Mon–Fri 6am–10pm PT",
        services: ["DTC Fulfillment", "Cold Storage"],
      },
    ],
    reviews: [
      {
        reviewerName: "Anna Whitfield",
        reviewerCompany: "Greengrove Foods",
        date: "2026-04-02",
        rating: 5,
        text:
          "Meridian is the only 3PL we've found that can run our refrigerated DTC and our Whole Foods retail program from the same facility. Saves us a full vendor relationship.",
        verified: true,
        helpful: 31,
      },
      {
        reviewerName: "Robert Glass",
        reviewerCompany: "Pacific Provisions",
        date: "2026-03-11",
        rating: 5,
        text:
          "Cold-chain compliance has been flawless. We've been audited twice for FDA and Meridian's documentation made it a non-event.",
        verified: true,
        helpful: 22,
      },
      {
        reviewerName: "Lara Conrad",
        reviewerCompany: "Mosswell Wellness",
        date: "2026-02-04",
        rating: 5,
        text:
          "Onboarding into retail (Target) took 6 weeks from scratch including EDI. Their compliance team led the entire thing.",
        verified: true,
        helpful: 17,
      },
      {
        reviewerName: "Karim Hassan",
        reviewerCompany: "Bluepine Tea Co.",
        date: "2026-01-08",
        rating: 4,
        text:
          "Great for B2B but DTC pricing is on the higher side for smaller brands. Worth it once you cross 1k orders/day.",
        verified: true,
        helpful: 12,
      },
      {
        reviewerName: "Helen Suri",
        reviewerCompany: "Ironbrook Provisions",
        date: "2025-12-22",
        rating: 5,
        text:
          "Their open-book pricing model is the reason we signed. No surprise fees in 14 months.",
        verified: true,
        helpful: 19,
      },
      {
        reviewerName: "Jin Park",
        reviewerCompany: "Cedar & Sage",
        date: "2025-11-04",
        rating: 4,
        text:
          "Multi-warehouse coordination is excellent. The dashboard could be more modern but the data is all there.",
        verified: false,
        helpful: 7,
      },
      {
        reviewerName: "Naomi Bakker",
        reviewerCompany: "Northway Naturals",
        date: "2025-09-30",
        rating: 5,
        text:
          "We needed 50,000 cubic feet of frozen storage on 30 days notice. Meridian delivered.",
        verified: true,
        helpful: 25,
      },
      {
        reviewerName: "Caleb Frost",
        reviewerCompany: "Kettlewood Roasters",
        date: "2025-08-14",
        rating: 5,
        text:
          "Customer support is responsive and pragmatic. They tell you when something is your fault, which I appreciate.",
        verified: true,
        helpful: 14,
      },
    ],
    ratingBreakdown: { 5: 142, 4: 32, 3: 9, 2: 4, 1: 2 },

    country: "USA",
    state: "texas",
    stateFullName: "Texas",
    city: "dallas",
    cityFullName: "Dallas",
    servedStates: ["texas", "california", "illinois", "georgia", "florida", "pennsylvania", "new-york", "ohio"],
    serviceCategories: ["cold-storage", "b2b-freight", "kitting-and-assembly", "dtc-fulfillment", "returns-management"],
  },
  {
    name: "Harbor Fulfillment Group",
    slug: "harbor-fulfillment-group",
    location: "Los Angeles, CA",
    rating: 4.7,
    reviewCount: 312,
    services: ["FBA Prep", "Container Drayage", "DTC Fulfillment"],
    verified: true,
    description:
      "West Coast port-adjacent fulfillment. Direct drayage from Long Beach and LA terminals plus integrated FBA prep on the same campus.",
    logoPlaceholder: "HF",

    tagline: "Port-adjacent drayage and FBA prep on a single West Coast campus.",
    yearFounded: 2011,
    employeeCount: "200–300",
    coverGradient: "blue-indigo",
    countryCode: "US",
    region: "California",
    specialties: ["Importers", "Amazon FBA Sellers", "Heavy & Bulky"],
    integrations: ["Amazon", "Shopify", "ShipStation", "SkuVault", "NetSuite"],
    certifications: ["ISO 9001", "C-TPAT"],
    minimumOrderVolume: "500",
    pricingModel: "Per-pick + drayage flat rate",
    responseTime: "Under 3 hours",
    fulfillmentSpeed: "Same-day cutoff 2pm PT",
    orderAccuracy: 99.4,
    yearsInBusiness: 14,
    activeBrandsServed: 270,
    contact: {
      phone: "+1 (562) 555-0211",
      email: "hello@harborfg.example",
      website: "https://harborfg.example",
    },
    about: [
      "Harbor Fulfillment Group was founded by a former drayage broker who saw importers paying twice — once to move containers from the port to a 3PL, and again to ship product into Amazon. Harbor's pitch is simple: do both on the same campus, eliminate the middle leg.",
      "Today Harbor operates a 320,000 sqft campus in Long Beach with bonded warehouse status and direct drayage from both Long Beach and LA ports. FBA prep happens in the same building, so containers can move from terminal to FNSKU-labeled inventory in 48 hours.",
      "Harbor specializes in importers and Amazon FBA sellers who need port-velocity inbound. They're not the right fit for boutique DTC — pricing structure favors brands moving 30+ containers per year.",
    ],
    detailedServices: [
      {
        name: "Port Drayage",
        description:
          "Direct container drayage from Long Beach and LA terminals.",
        included: true,
      },
      {
        name: "FBA Prep",
        description:
          "FNSKU labeling, polybagging, bundling, and direct FC injection.",
        included: true,
      },
      {
        name: "Bonded Warehousing",
        description: "Bonded storage for unfinished customs entries.",
        included: true,
      },
      {
        name: "DTC Pick & Pack",
        description: "DTC fulfillment for brands that ship from the West Coast.",
        included: true,
      },
      {
        name: "Inspection Services",
        description: "Quality control inspection on arriving containers.",
        included: false,
      },
    ],
    warehouses: [
      {
        city: "Los Angeles, CA",
        address: "2300 Pier S Ave, Long Beach, CA 90802",
        sqft: 320000,
        hours: "Mon–Sat 6am–12am PT",
        services: ["FBA Prep", "Drayage", "DTC Fulfillment", "Bonded Storage"],
      },
    ],
    reviews: [
      {
        reviewerName: "Stefan Vang",
        reviewerCompany: "Briarwood Imports",
        date: "2026-03-28",
        rating: 5,
        text:
          "Cut our terminal-to-FC time from 11 days to 4. The cost savings on demurrage alone paid for the migration.",
        verified: true,
        helpful: 41,
      },
      {
        reviewerName: "Mona Idris",
        reviewerCompany: "Westshore Toys",
        date: "2026-02-17",
        rating: 5,
        text:
          "We move 60 containers a year and Harbor just handles it. Drayage scheduling is automated and reliable.",
        verified: true,
        helpful: 28,
      },
      {
        reviewerName: "Drew Holtby",
        reviewerCompany: "Foundry Apparel",
        date: "2026-01-22",
        rating: 4,
        text:
          "FBA prep quality is excellent. DTC side is solid but if you only do DTC you can probably find better fits elsewhere.",
        verified: true,
        helpful: 11,
      },
      {
        reviewerName: "Rachel Quill",
        reviewerCompany: "Saltbreeze Surf",
        date: "2025-12-10",
        rating: 5,
        text:
          "Bonded warehouse capability saved us when we hit a customs delay last summer.",
        verified: true,
        helpful: 16,
      },
      {
        reviewerName: "Owen Bishop",
        reviewerCompany: "Pacific Range Outdoors",
        date: "2025-11-19",
        rating: 4,
        text:
          "Port-adjacent location is great for our FBA flow. Communication can be slower outside business hours.",
        verified: false,
        helpful: 6,
      },
      {
        reviewerName: "Joel Kashani",
        reviewerCompany: "Tidewater Goods",
        date: "2025-10-04",
        rating: 5,
        text:
          "If you're an importer doing FBA and you're not on Harbor, you're probably losing money.",
        verified: true,
        helpful: 33,
      },
      {
        reviewerName: "Kim Olafson",
        reviewerCompany: "Coastline Hardware",
        date: "2025-08-21",
        rating: 5,
        text:
          "Inspection service is a nice add-on that catches QC issues before product hits Amazon.",
        verified: true,
        helpful: 12,
      },
      {
        reviewerName: "Tatiana Rivers",
        reviewerCompany: "Kestrel Kitchen Goods",
        date: "2025-07-09",
        rating: 4,
        text:
          "Pricing is fair for the volume we do. Wouldn't recommend below 20 containers/year — minimums add up.",
        verified: true,
        helpful: 8,
      },
    ],
    ratingBreakdown: { 5: 218, 4: 64, 3: 18, 2: 8, 1: 4 },

    country: "USA",
    state: "california",
    stateFullName: "California",
    city: "los-angeles",
    cityFullName: "Los Angeles",
    servedStates: ["california"],
    serviceCategories: ["fba-prep-services", "dtc-fulfillment", "cross-border-fulfillment"],
  },
  {
    name: "Ironclad 3PL",
    slug: "ironclad-3pl",
    location: "Philadelphia, PA",
    rating: 4.9,
    reviewCount: 156,
    services: ["DTC Fulfillment", "Returns", "Subscription Boxes"],
    verified: true,
    description:
      "East Coast fulfillment hub built for subscription brands and high-velocity DTC. Two-day ground reaches 95% of US households from Philadelphia.",
    logoPlaceholder: "IC",

    tagline:
      "East Coast hub built for subscription brands and high-velocity DTC.",
    yearFounded: 2017,
    employeeCount: "80–120",
    coverGradient: "navy-blue",
    countryCode: "US",
    region: "Ohio",
    specialties: ["Subscription Boxes", "DTC Apparel", "Emerging Brands"],
    integrations: ["Shopify", "Recharge", "WooCommerce", "ShipStation", "Cratejoy"],
    certifications: ["ISO 9001"],
    minimumOrderVolume: "100",
    pricingModel: "Tiered per-pick, no storage minimums",
    responseTime: "Under 1 hour",
    fulfillmentSpeed: "Same-day cutoff 5pm ET",
    orderAccuracy: 99.8,
    yearsInBusiness: 8,
    activeBrandsServed: 96,
    contact: {
      phone: "+1 (215) 555-0167",
      email: "team@ironclad3pl.example",
      website: "https://ironclad3pl.example",
    },
    about: [
      "Ironclad started in a 12,000 sqft warehouse in northeast Philadelphia in 2017 with one anchor client — a subscription coffee brand that needed 4,000 boxes shipped on the first Tuesday of every month. The whole company was built around the constraint of nailing that high-stakes monthly cadence.",
      "Eight years later they're at 110,000 sqft and still subscription-first, with a particular obsession for DTC brands where the unboxing is the product. Custom dunnage, tissue paper, hand-tied ribbon — Ironclad will run all of it at 4,000 units/day without a quality regression.",
      "Their Philadelphia location is intentional: two-day ground reaches 95% of US households up and down the I-95 corridor, and one-day covers most of the Northeast and Mid-Atlantic. Most subscription brands hit a Friday-ship-Tuesday-arrive pattern that customer support never has to apologize for.",
    ],
    detailedServices: [
      {
        name: "Subscription Box Fulfillment",
        description:
          "Monthly cadence assembly with tissue, dunnage, and custom inserts.",
        included: true,
      },
      {
        name: "DTC Pick & Pack",
        description: "Same-day standard DTC fulfillment with 5pm ET cutoff.",
        included: true,
      },
      {
        name: "Returns Processing",
        description:
          "Customer-service-friendly returns with 48-hour disposition turnaround.",
        included: true,
      },
      {
        name: "Custom Packaging",
        description:
          "Hand-finished packaging including ribbon, tissue, and custom inserts.",
        included: true,
      },
      {
        name: "FBA Prep",
        description:
          "Light FBA prep available; not their primary specialty.",
        included: false,
      },
    ],
    warehouses: [
      {
        city: "Philadelphia, PA",
        address: "5800 Tulip St, Philadelphia, PA 19135",
        sqft: 110000,
        hours: "Mon–Fri 7am–9pm, Sat 9am–4pm ET",
        services: ["Subscription Boxes", "DTC Fulfillment", "Returns"],
      },
    ],
    reviews: [
      {
        reviewerName: "Maddie Yu",
        reviewerCompany: "Hearthbound Snacks",
        date: "2026-04-11",
        rating: 5,
        text:
          "Ironclad ships our 9,000 monthly boxes in a 36-hour window and we have not had a single quality complaint in 11 months. Genuinely magical.",
        verified: true,
        helpful: 47,
      },
      {
        reviewerName: "Asha Nirmal",
        reviewerCompany: "Quietfield Beauty",
        date: "2026-03-19",
        rating: 5,
        text:
          "The tissue paper folds. The ribbon ties. We trained them once and they've been pixel-perfect for two years.",
        verified: true,
        helpful: 26,
      },
      {
        reviewerName: "Brent Caldwell",
        reviewerCompany: "Stagline Mens",
        date: "2026-02-28",
        rating: 5,
        text:
          "5pm ET cutoff is a real cutoff, not a 'mostly' cutoff. Our orders go out same-day every time.",
        verified: true,
        helpful: 21,
      },
      {
        reviewerName: "Sade Williams",
        reviewerCompany: "Lakeside Pets",
        date: "2026-01-15",
        rating: 5,
        text:
          "Pick accuracy on subscription assembly is something I genuinely don't worry about anymore.",
        verified: true,
        helpful: 18,
      },
      {
        reviewerName: "Marco DiSilva",
        reviewerCompany: "Drift & Co.",
        date: "2025-11-22",
        rating: 4,
        text:
          "Excellent for subscription. We outgrew them on the FBA side once we crossed 100k units/quarter.",
        verified: true,
        helpful: 9,
      },
      {
        reviewerName: "Quinn Avery",
        reviewerCompany: "Ridgewood Roast",
        date: "2025-10-03",
        rating: 5,
        text:
          "Our customer support tickets dropped 40% after we moved here. The product just arrives correctly.",
        verified: true,
        helpful: 22,
      },
      {
        reviewerName: "Lena Park",
        reviewerCompany: "Heatherstone Home",
        date: "2025-08-29",
        rating: 5,
        text:
          "Their team feels like a part of our company. Annual planning calls with the GM are the norm.",
        verified: true,
        helpful: 14,
      },
      {
        reviewerName: "Tomáš Novák",
        reviewerCompany: "Boldgrain",
        date: "2025-07-18",
        rating: 5,
        text:
          "Hands-down the best 3PL we've worked with for subscription. If you can fit their model, sign.",
        verified: true,
        helpful: 31,
      },
    ],
    ratingBreakdown: { 5: 132, 4: 18, 3: 4, 2: 1, 1: 1 },

    country: "USA",
    state: "pennsylvania",
    stateFullName: "Pennsylvania",
    city: "philadelphia",
    cityFullName: "Philadelphia",
    servedStates: ["pennsylvania", "ohio", "new-york", "illinois"],
    serviceCategories: ["dtc-fulfillment", "returns-management", "subscription-box-fulfillment", "kitting-and-assembly"],
  },
  {
    name: "Saltwater Supply Co.",
    slug: "saltwater-supply-co",
    location: "New York City, NY",
    rating: 4.6,
    reviewCount: 98,
    services: ["DTC Fulfillment", "Kitting", "Apparel"],
    verified: true,
    description:
      "Boutique fulfillment for premium apparel and lifestyle brands. White-glove kitting, hand-finished packaging, and custom inserts.",
    logoPlaceholder: "SS",

    tagline: "Boutique fulfillment for premium apparel and lifestyle.",
    yearFounded: 2019,
    employeeCount: "30–50",
    coverGradient: "blue-indigo",
    countryCode: "US",
    region: "New York",
    specialties: ["Premium Apparel", "Lifestyle", "Editorial Brands"],
    integrations: ["Shopify", "WooCommerce", "ShipStation"],
    certifications: ["ISO 9001"],
    minimumOrderVolume: "100",
    pricingModel: "Per-pick + storage, custom for editorial brands",
    responseTime: "Under 2 hours",
    fulfillmentSpeed: "Same-day cutoff 4pm ET",
    orderAccuracy: 99.5,
    yearsInBusiness: 6,
    activeBrandsServed: 42,
    contact: {
      phone: "+1 (718) 555-0144",
      email: "studio@saltwatersupply.example",
      website: "https://saltwatersupply.example",
    },
    about: [
      "Saltwater Supply Co. is a 6-year-old boutique 3PL in Industry City, Brooklyn, founded by a former production manager from a heritage menswear brand. The studio operates more like a fulfillment atelier than a warehouse — every brand gets a dedicated packing line and signed-off packaging spec.",
      "Their roster is intentionally small: 42 active brands, all premium apparel, lifestyle, or editorial. Growth has been by referral only since 2021.",
      "Saltwater is the right partner for brands where the unboxing is half the product — wax-sealed inserts, embossed cards, hand-rolled tissue, photo-grade packaging consistency. They are not the right partner for high-velocity volume DTC; their cap is roughly 80,000 orders per month across all clients.",
    ],
    detailedServices: [
      {
        name: "Editorial Pick & Pack",
        description:
          "White-glove pick-and-pack with hand-finished packaging and signed packing slips.",
        included: true,
      },
      {
        name: "Custom Kitting",
        description:
          "Per-brand kit assembly including welcome boxes, gift sets, and lookbooks.",
        included: true,
      },
      {
        name: "Returns Processing",
        description:
          "Returns with garment inspection and brand-grade restocking.",
        included: true,
      },
      {
        name: "Photography Studio Access",
        description: "Optional access to in-house photo studio for product shoots.",
        included: false,
      },
    ],
    warehouses: [
      {
        city: "Brooklyn, NY",
        address: "274 36th St, Brooklyn, NY 11232",
        sqft: 32000,
        hours: "Mon–Fri 9am–6pm ET",
        services: ["DTC Fulfillment", "Kitting", "Returns"],
      },
    ],
    reviews: [
      {
        reviewerName: "Iris Kowalski",
        reviewerCompany: "Field Notes Goods",
        date: "2026-02-14",
        rating: 5,
        text:
          "Saltwater treats our packaging like a piece of our brand identity. Worth every cent.",
        verified: true,
        helpful: 20,
      },
      {
        reviewerName: "Joseph Marek",
        reviewerCompany: "Greycoast Mens",
        date: "2026-01-08",
        rating: 5,
        text:
          "Photographers, stylists, and our 3PL all in the same building. Saved us a lot of logistics overhead.",
        verified: true,
        helpful: 14,
      },
      {
        reviewerName: "Vanessa Roe",
        reviewerCompany: "Linenwood",
        date: "2025-12-02",
        rating: 4,
        text:
          "Beautiful work. They're not built for our peak volumes during sale, so we use them for editorial drops only.",
        verified: true,
        helpful: 9,
      },
      {
        reviewerName: "Anders Pelle",
        reviewerCompany: "Brookfield Press",
        date: "2025-10-20",
        rating: 5,
        text:
          "The packing slip quality alone justified the migration. Customers comment on the boxes.",
        verified: true,
        helpful: 11,
      },
      {
        reviewerName: "Maya Beaumont",
        reviewerCompany: "Highmark Studio",
        date: "2025-08-05",
        rating: 4,
        text:
          "Pricing is high but you get what you pay for. Communication is direct and human.",
        verified: false,
        helpful: 5,
      },
      {
        reviewerName: "Trent Olosky",
        reviewerCompany: "Northpoint Knitwear",
        date: "2025-06-19",
        rating: 5,
        text:
          "Best partner we've had for editorial drops. They flex to our schedule.",
        verified: true,
        helpful: 8,
      },
      {
        reviewerName: "Lillian Hart",
        reviewerCompany: "Wovenfield",
        date: "2025-05-11",
        rating: 5,
        text:
          "Inventory accuracy on our small-batch SKUs has been spotless.",
        verified: true,
        helpful: 6,
      },
      {
        reviewerName: "Sebastián Cruz",
        reviewerCompany: "Atlas & Oar",
        date: "2025-04-22",
        rating: 4,
        text:
          "Capacity is the limiting factor. Plan ahead during Q4.",
        verified: true,
        helpful: 4,
      },
    ],
    ratingBreakdown: { 5: 64, 4: 24, 3: 6, 2: 2, 1: 2 },

    country: "USA",
    state: "new-york",
    stateFullName: "New York",
    city: "new-york-city",
    cityFullName: "New York City",
    servedStates: ["new-york"],
    serviceCategories: ["dtc-fulfillment", "kitting-and-assembly", "subscription-box-fulfillment"],
  },
  {
    name: "Beacon Warehousing",
    slug: "beacon-warehousing",
    location: "Manchester, UK",
    rating: 4.8,
    reviewCount: 174,
    services: ["DTC Fulfillment", "FBA Prep", "EU Distribution"],
    verified: true,
    description:
      "UK and EU fulfillment under one roof. IOSS-compliant cross-border shipping and Amazon UK FBA prep with same-day inbound receiving.",
    logoPlaceholder: "BW",

    tagline: "UK + EU fulfillment with IOSS-compliant cross-border shipping.",
    yearFounded: 2013,
    employeeCount: "150–200",
    coverGradient: "navy-blue",
    countryCode: "GB",
    region: "North West England",
    specialties: ["UK DTC Brands", "Cross-Border EU", "Amazon UK Sellers"],
    integrations: ["Shopify", "Amazon", "Magento", "BigCommerce", "NetSuite"],
    certifications: ["ISO 9001", "AEO"],
    minimumOrderVolume: "500",
    pricingModel: "Per-pick + storage, EU duty pass-through",
    responseTime: "Under 3 hours",
    fulfillmentSpeed: "Same-day cutoff 4pm GMT",
    orderAccuracy: 99.6,
    yearsInBusiness: 12,
    activeBrandsServed: 142,
    contact: {
      phone: "+44 161 555 0143",
      email: "hello@beaconwarehousing.example",
      website: "https://beaconwarehousing.example",
    },
    about: [
      "Beacon Warehousing was founded in 2013 to solve the cross-border headache for UK DTC brands. After Brexit, the IOSS and OSS requirements made shipping into the EU operationally nontrivial; Beacon built a registered presence in both the UK and Netherlands so brands could ship duty-paid to consumers across both regions from one inventory pool.",
      "Their Manchester facility is the UK anchor (160,000 sqft), with a second 60,000 sqft Rotterdam facility for direct EU dispatch. AEO status means lower customs scrutiny on inbound containers and faster releases.",
      "Beacon is the right fit for UK brands expanding into the EU, EU brands needing UK presence post-Brexit, and Amazon UK sellers who want FBA prep without sacrificing DTC capability.",
    ],
    detailedServices: [
      {
        name: "UK DTC Pick & Pack",
        description: "Domestic UK fulfillment with same-day cutoff at 4pm GMT.",
        included: true,
      },
      {
        name: "EU Distribution",
        description:
          "IOSS/OSS-compliant duty-paid shipments from Rotterdam to all EU consumers.",
        included: true,
      },
      {
        name: "Amazon UK FBA Prep",
        description:
          "FBA prep, FNSKU labeling, and direct injection into Amazon UK FCs.",
        included: true,
      },
      {
        name: "Cross-Border Returns",
        description:
          "Consolidated EU returns with duty reclaim handling.",
        included: false,
      },
    ],
    warehouses: [
      {
        city: "Manchester, UK",
        address: "Trafford Park, Manchester M17 1QS",
        sqft: 160000,
        hours: "Mon–Sat 6am–10pm GMT",
        services: ["DTC Fulfillment", "FBA Prep", "Returns"],
      },
      {
        city: "Rotterdam, NL",
        address: "Distripark Maasvlakte 5, 3199 LB Rotterdam",
        sqft: 60000,
        hours: "Mon–Fri 7am–8pm CET",
        services: ["EU Distribution", "Cross-Border", "Bonded Storage"],
      },
    ],
    reviews: [
      {
        reviewerName: "Oliver Hartley",
        reviewerCompany: "Tideland Goods",
        date: "2026-04-04",
        rating: 5,
        text:
          "Beacon's IOSS handling solved a problem we'd been bleeding margin on for two years. EU returns are still a headache, but on the dispatch side it's flawless.",
        verified: true,
        helpful: 33,
      },
      {
        reviewerName: "Imogen Field",
        reviewerCompany: "Fenwood Cosmetics",
        date: "2026-02-18",
        rating: 5,
        text:
          "Same-day UK cutoff means our Manchester orders arrive next-day across the country. Our customer support team is genuinely happier.",
        verified: true,
        helpful: 19,
      },
      {
        reviewerName: "Ravi Shankar",
        reviewerCompany: "Bridge & Burn UK",
        date: "2026-01-09",
        rating: 5,
        text:
          "Onboarded our UK fulfillment in 3 weeks including Amazon UK FBA integration. Fast and methodical.",
        verified: true,
        helpful: 14,
      },
      {
        reviewerName: "Sophie Larsson",
        reviewerCompany: "Northwood Apparel",
        date: "2025-11-26",
        rating: 4,
        text:
          "Excellent UK operation. EU side is good but slightly more expensive than dedicated EU 3PLs.",
        verified: true,
        helpful: 8,
      },
      {
        reviewerName: "Chris Nakamura",
        reviewerCompany: "Mossbrook Clothing",
        date: "2025-10-12",
        rating: 5,
        text:
          "AEO status on inbound containers cut our customs delays by half.",
        verified: true,
        helpful: 16,
      },
      {
        reviewerName: "Lena Pohl",
        reviewerCompany: "Halle & Söhne",
        date: "2025-09-08",
        rating: 5,
        text:
          "We're a German brand and Beacon is our UK warehouse. The communication crosses Channels (literally) without friction.",
        verified: true,
        helpful: 11,
      },
      {
        reviewerName: "Aaliyah Wright",
        reviewerCompany: "Saltbeck Beauty",
        date: "2025-07-22",
        rating: 4,
        text:
          "Solid all-around. Wish their dashboard was a bit more modern but data is accurate.",
        verified: false,
        helpful: 5,
      },
      {
        reviewerName: "Mateo Vega",
        reviewerCompany: "Westgate Provisions",
        date: "2025-06-04",
        rating: 5,
        text:
          "Dual-location strategy is the only reason we can run both UK and EU DTC profitably.",
        verified: true,
        helpful: 22,
      },
    ],
    ratingBreakdown: { 5: 128, 4: 32, 3: 9, 2: 3, 1: 2 },

    country: "UK",
    state: "england",
    stateFullName: "England",
    city: "manchester",
    cityFullName: "Manchester",
    servedStates: ["england", "scotland"],
    serviceCategories: ["dtc-fulfillment", "fba-prep-services", "cross-border-fulfillment", "returns-management"],
  },
  // ----- New for Phase 1B (6 more, totaling 12) -----
  {
    name: "Cascade Logistics",
    slug: "cascade-logistics",
    location: "San Francisco, CA",
    rating: 4.7,
    reviewCount: 142,
    services: ["DTC Fulfillment", "Cross-Border", "Returns"],
    verified: true,
    description:
      "Northern California 3PL with strong cross-border Canada flows and West Coast 2-day reach into the PNW and BC.",
    logoPlaceholder: "CL",

    tagline: "West Coast fulfillment with strong cross-border Canada flows.",
    yearFounded: 2015,
    employeeCount: "100–140",
    coverGradient: "blue-indigo",
    countryCode: "US",
    region: "Washington",
    specialties: ["Outdoor", "PNW Brands", "Cross-Border Canada"],
    integrations: ["Shopify", "WooCommerce", "BigCommerce", "ShipStation"],
    certifications: ["ISO 9001", "C-TPAT"],
    minimumOrderVolume: "100",
    pricingModel: "Per-pick + storage, Canada cross-border flat rate",
    responseTime: "Under 3 hours",
    fulfillmentSpeed: "Same-day cutoff 3pm PT",
    orderAccuracy: 99.5,
    yearsInBusiness: 10,
    activeBrandsServed: 88,
    contact: {
      phone: "+1 (415) 555-0188",
      email: "team@cascadelogistics.example",
      website: "https://cascadelogistics.example",
    },
    about: [
      "Cascade Logistics opened in San Francisco in 2015 with a thesis: West Coast outdoor and lifestyle brands shouldn't have to ship from Ohio. Two-day ground from Cascade covers all of California, most of Oregon, Washington, Nevada, and southern BC — most of the customer base for the brands they serve.",
      "Cross-border flows into Canada remain a core capability — the team built the original PNW Canada infrastructure before relocating south. Cascade is C-TPAT certified and offers consolidated DDP shipping into Canada via either Pacific Highway or Detroit, which removes the customs friction Canadian customers usually hit on US DTC orders.",
      "Cascade's 140-person team specializes in outdoor, technical apparel, and West Coast lifestyle brands. They are not the right fit if your customer base is primarily East Coast.",
    ],
    detailedServices: [
      {
        name: "DTC Pick & Pack",
        description: "Standard DTC with PNW-region two-day ground coverage.",
        included: true,
      },
      {
        name: "Cross-Border Canada",
        description:
          "Consolidated DDP shipments into Canada, customs cleared.",
        included: true,
      },
      {
        name: "Returns Processing",
        description: "Domestic and Canada returns with disposition reporting.",
        included: true,
      },
      {
        name: "FBA Prep",
        description: "Light FBA prep available, not their specialty.",
        included: false,
      },
    ],
    warehouses: [
      {
        city: "South San Francisco, CA",
        address: "350 Forbes Blvd, South San Francisco, CA 94080",
        sqft: 95000,
        hours: "Mon–Fri 6am–9pm PT",
        services: ["DTC Fulfillment", "Cross-Border", "Returns"],
      },
    ],
    reviews: [
      {
        reviewerName: "Jamie Holst",
        reviewerCompany: "Rainier Trail Co.",
        date: "2026-03-22",
        rating: 5,
        text:
          "Best PNW 3PL we've used. Two-day to Vancouver via DDP is a real differentiator for our Canadian growth.",
        verified: true,
        helpful: 19,
      },
      {
        reviewerName: "Beatriz Ramos",
        reviewerCompany: "Forestbed Apparel",
        date: "2026-02-09",
        rating: 5,
        text:
          "Cross-border DDP saved us our Canadian customer base. Conversion rate jumped 18% after we launched it.",
        verified: true,
        helpful: 22,
      },
      {
        reviewerName: "Alec Greenwood",
        reviewerCompany: "Northsound Bikes",
        date: "2025-12-12",
        rating: 4,
        text:
          "Solid for PNW operations. East Coast shipping is via UPS/FedEx and timing is what you'd expect.",
        verified: true,
        helpful: 6,
      },
      {
        reviewerName: "Yuki Mori",
        reviewerCompany: "Driftwood Pet",
        date: "2025-11-04",
        rating: 5,
        text:
          "Onboarding was fast and the team is responsive. Returns reporting is clean.",
        verified: true,
        helpful: 9,
      },
      {
        reviewerName: "Hannah Strom",
        reviewerCompany: "Greylight Gear",
        date: "2025-09-19",
        rating: 5,
        text:
          "We migrated from a national 3PL specifically for the cross-border capability. Worth it.",
        verified: true,
        helpful: 13,
      },
      {
        reviewerName: "Park Min-jun",
        reviewerCompany: "Coastline Active",
        date: "2025-07-29",
        rating: 4,
        text:
          "Pricing is fair, accuracy is high. Wish they had East Coast capacity for our future growth.",
        verified: false,
        helpful: 4,
      },
      {
        reviewerName: "Diana Frost",
        reviewerCompany: "Tahoma Goods",
        date: "2025-05-15",
        rating: 5,
        text:
          "Account management is best-in-class for a 3PL of this size.",
        verified: true,
        helpful: 8,
      },
      {
        reviewerName: "Reed McCarthy",
        reviewerCompany: "Olympia Outdoor",
        date: "2025-04-02",
        rating: 5,
        text:
          "Reliable, calm, methodical. Exactly what you want from a 3PL.",
        verified: true,
        helpful: 11,
      },
    ],
    ratingBreakdown: { 5: 96, 4: 32, 3: 8, 2: 4, 1: 2 },

    country: "USA",
    state: "california",
    stateFullName: "California",
    city: null,
    cityFullName: null,
    servedStates: ["california"],
    serviceCategories: ["dtc-fulfillment", "cross-border-fulfillment", "returns-management", "fba-prep-services"],
  },
  {
    name: "Stonebridge 3PL",
    slug: "stonebridge-3pl",
    location: "Atlanta, GA",
    rating: 4.6,
    reviewCount: 207,
    services: ["DTC Fulfillment", "B2B Freight", "Heavy & Bulky"],
    verified: true,
    description:
      "Southeast 3PL covering DTC, B2B retail, and oversized/bulky fulfillment. Strong intermodal rail access.",
    logoPlaceholder: "SB",

    tagline: "Southeast 3PL with deep B2B retail and heavy/bulky chops.",
    yearFounded: 2010,
    employeeCount: "250–350",
    coverGradient: "navy-amber",
    countryCode: "US",
    region: "Georgia",
    specialties: ["Heavy & Bulky", "Furniture", "B2B Retail Compliance"],
    integrations: ["NetSuite", "Shopify", "Magento", "Amazon"],
    certifications: ["ISO 9001", "SOC 2"],
    minimumOrderVolume: "500",
    pricingModel: "Per-pick + freight pass-through, custom for heavy/bulky",
    responseTime: "Under 4 hours",
    fulfillmentSpeed: "Same-day cutoff 2pm ET",
    orderAccuracy: 99.4,
    yearsInBusiness: 15,
    activeBrandsServed: 196,
    contact: {
      phone: "+1 (404) 555-0119",
      email: "info@stonebridge3pl.example",
      website: "https://stonebridge3pl.example",
    },
    about: [
      "Stonebridge has been an Atlanta-area 3PL since 2010, originally serving regional B2B retail. Over time the business pivoted to support eCommerce brands shipping into the same retailers — Home Depot, Lowe's, Wayfair, Costco — alongside their DTC channel.",
      "They specialize in oversized and bulky DTC: furniture, fitness equipment, outdoor goods, and large-format home items. Their facilities are built for parcel + LTL hybrid flows, not pure parcel.",
      "Stonebridge has direct intermodal rail access from Savannah, which makes them a good operational fit for importers whose Southeast retail customers expect rail-via-Atlanta routing rather than over-the-road freight.",
    ],
    detailedServices: [
      {
        name: "Heavy & Bulky DTC",
        description:
          "Oversized parcel and LTL home delivery for furniture, fitness, and large-format goods.",
        included: true,
      },
      {
        name: "B2B Retail Compliance",
        description:
          "EDI, ASN, and routing-guide compliance for major US big-box retailers.",
        included: true,
      },
      {
        name: "Intermodal Drayage",
        description:
          "Direct rail drayage from Savannah and Atlanta intermodal terminals.",
        included: true,
      },
      {
        name: "Standard DTC",
        description: "Standard parcel DTC for non-bulky SKUs.",
        included: true,
      },
      {
        name: "White-Glove Delivery",
        description:
          "Threshold and room-of-choice delivery via partnered last-mile carriers.",
        included: false,
      },
    ],
    warehouses: [
      {
        city: "Atlanta, GA",
        address: "4500 Fulton Industrial Blvd, Atlanta, GA 30336",
        sqft: 220000,
        hours: "Mon–Sat 5am–11pm ET",
        services: ["B2B Freight", "Heavy & Bulky", "DTC"],
      },
      {
        city: "Savannah, GA",
        address: "100 Tradeport Dr, Pooler, GA 31322",
        sqft: 140000,
        hours: "Mon–Fri 6am–10pm ET",
        services: ["Drayage", "Cross-Dock"],
      },
    ],
    reviews: [
      {
        reviewerName: "Patricia Holm",
        reviewerCompany: "Cedar Rest Furniture",
        date: "2026-03-30",
        rating: 5,
        text:
          "Stonebridge handles our entire furniture DTC including last-mile threshold delivery. Damage rates dropped from 6% to under 1%.",
        verified: true,
        helpful: 26,
      },
      {
        reviewerName: "Joel Aberle",
        reviewerCompany: "Fairmont Fitness",
        date: "2026-02-14",
        rating: 5,
        text:
          "Heavy and bulky fulfillment is genuinely hard. Stonebridge gets it. We sleep better at night.",
        verified: true,
        helpful: 18,
      },
      {
        reviewerName: "Tina Mendelsohn",
        reviewerCompany: "Halepine Outdoor",
        date: "2025-12-19",
        rating: 4,
        text:
          "Parcel rates are average; LTL rates are excellent because of their intermodal access.",
        verified: true,
        helpful: 9,
      },
      {
        reviewerName: "Chen Wei",
        reviewerCompany: "Foundry Home",
        date: "2025-10-30",
        rating: 5,
        text:
          "EDI integration with Wayfair was set up in 4 weeks. Their compliance team led the project.",
        verified: true,
        helpful: 14,
      },
      {
        reviewerName: "Olivia Bell",
        reviewerCompany: "Cottagewood Goods",
        date: "2025-09-04",
        rating: 4,
        text:
          "Strong on heavy. Standard parcel DTC is competent but not their best work.",
        verified: false,
        helpful: 6,
      },
      {
        reviewerName: "Rashid Khouri",
        reviewerCompany: "Trailhead Bikes",
        date: "2025-07-21",
        rating: 5,
        text:
          "Bike fulfillment with proper assembly and delivery is rare. Stonebridge handles it correctly.",
        verified: true,
        helpful: 13,
      },
      {
        reviewerName: "Mariana Costa",
        reviewerCompany: "Brightwell Pet Beds",
        date: "2025-05-08",
        rating: 5,
        text:
          "Great fit for Southeast-heavy customer base. Two-day to Florida is consistent.",
        verified: true,
        helpful: 7,
      },
      {
        reviewerName: "Eric Olson",
        reviewerCompany: "Westgate Mens Apparel",
        date: "2025-03-18",
        rating: 4,
        text:
          "Decent DTC, exceptional B2B. We use them for both even though their personality is B2B-first.",
        verified: true,
        helpful: 5,
      },
    ],
    ratingBreakdown: { 5: 128, 4: 56, 3: 14, 2: 6, 1: 3 },

    country: "USA",
    state: "georgia",
    stateFullName: "Georgia",
    city: "atlanta",
    cityFullName: "Atlanta",
    servedStates: ["georgia", "florida", "pennsylvania", "ohio", "illinois", "new-york"],
    serviceCategories: ["dtc-fulfillment", "b2b-freight", "kitting-and-assembly", "returns-management"],
  },
  {
    name: "Pinewood Distribution",
    slug: "pinewood-distribution",
    location: "Vancouver, BC",
    rating: 4.8,
    reviewCount: 119,
    services: ["DTC Fulfillment", "Cross-Border", "Returns"],
    verified: true,
    description:
      "British Columbia 3PL with deep cross-border US flows. Specialists in Canadian DTC and Amazon.ca FBA prep.",
    logoPlaceholder: "PD",

    tagline: "Vancouver-based 3PL specializing in Canadian DTC and Amazon.ca.",
    yearFounded: 2016,
    employeeCount: "60–90",
    coverGradient: "navy-blue",
    countryCode: "CA",
    region: "British Columbia",
    specialties: ["Canadian DTC", "Amazon.ca FBA", "Cross-Border US"],
    integrations: ["Shopify", "Amazon", "WooCommerce", "ShipStation"],
    certifications: ["ISO 9001", "C-TPAT"],
    minimumOrderVolume: "100",
    pricingModel: "Per-pick + storage, US duty pass-through",
    responseTime: "Under 2 hours",
    fulfillmentSpeed: "Same-day cutoff 4pm PT",
    orderAccuracy: 99.6,
    yearsInBusiness: 9,
    activeBrandsServed: 78,
    contact: {
      phone: "+1 (604) 555-0156",
      email: "hello@pinewooddist.example",
      website: "https://pinewooddist.example",
    },
    about: [
      "Pinewood Distribution opened in Burnaby in 2016 to serve a specific gap: Canadian eCommerce brands needed a 3PL that could handle Amazon.ca FBA prep and DTC together, ideally with cross-border US capability for brands selling into both markets.",
      "Pinewood operates a single 70,000 sqft facility in Burnaby, BC, plus a small US-bonded operation in Blaine, WA for cross-border consolidation. Most Canadian brands they work with also ship into the US via that bonded arrangement, with consolidated customs entries that save duty and brokerage on small parcels.",
      "Their team is 60% bilingual French/English, which matters for brands selling into Quebec — packaging copy, customer service handoffs, and documentation can be issued in French at no upcharge.",
    ],
    detailedServices: [
      {
        name: "Canadian DTC Pick & Pack",
        description:
          "Domestic Canada fulfillment with same-day 4pm PT cutoff.",
        included: true,
      },
      {
        name: "Amazon.ca FBA Prep",
        description:
          "FNSKU labeling, polybagging, and direct injection into Amazon.ca FCs.",
        included: true,
      },
      {
        name: "Cross-Border US",
        description:
          "Consolidated US shipments via Blaine, WA with duty pass-through.",
        included: true,
      },
      {
        name: "French-Language Support",
        description:
          "Bilingual customer service handoffs and French packaging copy.",
        included: true,
      },
      {
        name: "Returns Processing",
        description: "Canadian and US returns with disposition reporting.",
        included: false,
      },
    ],
    warehouses: [
      {
        city: "Burnaby, BC",
        address: "8500 Bridgeport Rd, Richmond, BC V6X 1R7",
        sqft: 70000,
        hours: "Mon–Fri 6am–9pm, Sat 8am–2pm PT",
        services: ["DTC Fulfillment", "Amazon.ca FBA", "Returns"],
      },
      {
        city: "Blaine, WA (bonded)",
        address: "1850 H St, Blaine, WA 98230",
        sqft: 18000,
        hours: "Mon–Fri 7am–6pm PT",
        services: ["Cross-Border", "Bonded Storage"],
      },
    ],
    reviews: [
      {
        reviewerName: "Camille Dubois",
        reviewerCompany: "Maison Brûlerie",
        date: "2026-04-08",
        rating: 5,
        text:
          "Bilingual support was the deal-breaker for us. Quebec customers get correct French copy on every package.",
        verified: true,
        helpful: 24,
      },
      {
        reviewerName: "Henrik Thorsen",
        reviewerCompany: "Lakeward Pet",
        date: "2026-03-02",
        rating: 5,
        text:
          "Pinewood handles Amazon.ca FBA and DTC under one roof. Saves us a vendor.",
        verified: true,
        helpful: 17,
      },
      {
        reviewerName: "Riya Mehra",
        reviewerCompany: "Glenwood Apparel",
        date: "2026-01-20",
        rating: 4,
        text:
          "Excellent ops. The dashboard is functional but not modern. Data is correct.",
        verified: true,
        helpful: 7,
      },
      {
        reviewerName: "Antoine Pelletier",
        reviewerCompany: "Mosswood Spirits",
        date: "2025-11-09",
        rating: 5,
        text:
          "Cross-border consolidated entries are a real differentiator. We saved $40k in brokerage last year.",
        verified: true,
        helpful: 21,
      },
      {
        reviewerName: "Stephanie Rouge",
        reviewerCompany: "Northstar Tea",
        date: "2025-09-26",
        rating: 5,
        text:
          "Onboarded us in 2 weeks including Amazon.ca FBA setup. Smooth.",
        verified: true,
        helpful: 11,
      },
      {
        reviewerName: "Jonas Becker",
        reviewerCompany: "Saltrun Cosmetics",
        date: "2025-08-04",
        rating: 4,
        text:
          "Great for Canada. Their US side is small but functional for our volume.",
        verified: false,
        helpful: 5,
      },
      {
        reviewerName: "Mei Wong",
        reviewerCompany: "Coastal Carriers Co.",
        date: "2025-06-13",
        rating: 5,
        text:
          "Pinewood's account managers are responsive and pragmatic.",
        verified: true,
        helpful: 9,
      },
      {
        reviewerName: "Greg Halloran",
        reviewerCompany: "Cedarpoint Goods",
        date: "2025-04-25",
        rating: 5,
        text:
          "Two years in, zero stockouts caused by inbound delays. That's the metric I care about.",
        verified: true,
        helpful: 13,
      },
    ],
    ratingBreakdown: { 5: 78, 4: 28, 3: 8, 2: 3, 1: 2 },

    country: "Canada",
    state: "british-columbia",
    stateFullName: "British Columbia",
    city: "vancouver",
    cityFullName: "Vancouver",
    servedStates: ["british-columbia", "alberta"],
    serviceCategories: ["dtc-fulfillment", "fba-prep-services", "returns-management", "cross-border-fulfillment"],
  },
  {
    name: "Aldermere Fulfillment",
    slug: "aldermere-fulfillment",
    location: "Chicago, IL",
    rating: 4.5,
    reviewCount: 263,
    services: ["DTC Fulfillment", "FBA Prep", "B2B Freight"],
    verified: true,
    description:
      "Midwest 3PL with strong national 2-day ground coverage and an integrated FBA prep line.",
    logoPlaceholder: "AF",

    tagline: "Chicago 3PL with national 2-day reach and integrated FBA prep.",
    yearFounded: 2009,
    employeeCount: "300–400",
    coverGradient: "navy-amber",
    countryCode: "US",
    region: "Illinois",
    specialties: ["High-Volume DTC", "Amazon FBA Sellers", "Health & Beauty"],
    integrations: [
      "Shopify",
      "Amazon",
      "BigCommerce",
      "Magento",
      "NetSuite",
      "ShipStation",
    ],
    certifications: ["ISO 9001", "FDA Registered"],
    minimumOrderVolume: "500",
    pricingModel: "Tiered per-pick, custom B2B freight",
    responseTime: "Under 4 hours",
    fulfillmentSpeed: "Same-day cutoff 4pm CT",
    orderAccuracy: 99.3,
    yearsInBusiness: 16,
    activeBrandsServed: 240,
    contact: {
      phone: "+1 (312) 555-0177",
      email: "team@aldermerefulfillment.example",
      website: "https://aldermerefulfillment.example",
    },
    about: [
      "Aldermere has operated out of Chicagoland since 2009, currently running a 280,000 sqft anchor facility in Aurora plus a 110,000 sqft secondary in Joliet. Their position in the Midwest gives them genuine 2-day ground coverage to almost all of the continental US.",
      "They scale well for high-volume DTC brands that have outgrown a starter 3PL. Their FBA prep line runs in parallel with DTC, and their pricing rewards volume — brands shipping under 5k orders/month often find better unit economics elsewhere.",
      "Aldermere's tradeoff is breadth over depth: they're solid at most things but don't own a category the way Ironclad owns subscriptions or Saltwater owns editorial. Pick them for boring, reliable, high-volume operations.",
    ],
    detailedServices: [
      {
        name: "DTC Pick & Pack",
        description: "Standard DTC at scale with national 2-day reach.",
        included: true,
      },
      {
        name: "FBA Prep",
        description: "FNSKU labeling and direct FBA injection on a parallel line.",
        included: true,
      },
      {
        name: "B2B Freight",
        description: "LTL and FTL pallet shipping to retail customers.",
        included: true,
      },
      {
        name: "Returns Processing",
        description: "Returns with standard disposition reporting.",
        included: true,
      },
      {
        name: "Custom Packaging",
        description: "Light custom packaging available; not specialized.",
        included: false,
      },
    ],
    warehouses: [
      {
        city: "Aurora, IL",
        address: "1500 Aurora Industrial Pkwy, Aurora, IL 60506",
        sqft: 280000,
        hours: "Mon–Sat 5am–11pm CT",
        services: ["DTC Fulfillment", "FBA Prep", "Returns"],
      },
      {
        city: "Joliet, IL",
        address: "3400 Channahon Rd, Joliet, IL 60436",
        sqft: 110000,
        hours: "Mon–Fri 6am–10pm CT",
        services: ["B2B Freight", "Cross-Dock"],
      },
    ],
    reviews: [
      {
        reviewerName: "Kelly Mahoney",
        reviewerCompany: "Stonepath Beauty",
        date: "2026-04-01",
        rating: 5,
        text:
          "Reliable 3PL for high-volume DTC. We do 80k orders/month and Aldermere just executes.",
        verified: true,
        helpful: 22,
      },
      {
        reviewerName: "Diego Ramos",
        reviewerCompany: "Boldcrest Supplements",
        date: "2026-02-19",
        rating: 4,
        text:
          "Good operationally. Reporting is functional but not insightful. We supplement with our own BI.",
        verified: true,
        helpful: 9,
      },
      {
        reviewerName: "Rebecca Liu",
        reviewerCompany: "Greatlake Goods",
        date: "2025-12-27",
        rating: 5,
        text:
          "Two-day ground coverage from Chicago is the reason we're with Aldermere. Customer satisfaction is up.",
        verified: true,
        helpful: 16,
      },
      {
        reviewerName: "Aaron Pomerantz",
        reviewerCompany: "Brightside Co.",
        date: "2025-11-15",
        rating: 4,
        text:
          "Solid for high volume. Customer support is slower than smaller 3PLs but capable when reached.",
        verified: false,
        helpful: 5,
      },
      {
        reviewerName: "Helga Borchert",
        reviewerCompany: "Lakeshore Pet",
        date: "2025-09-08",
        rating: 5,
        text:
          "FBA prep and DTC under one roof has been operationally clean for 3 years.",
        verified: true,
        helpful: 14,
      },
      {
        reviewerName: "Maxine Tovar",
        reviewerCompany: "Hawthorn Beauty",
        date: "2025-07-30",
        rating: 4,
        text:
          "Pricing is competitive at our volume. Below 5k orders/month I'd look elsewhere.",
        verified: true,
        helpful: 7,
      },
      {
        reviewerName: "Yuto Sakamoto",
        reviewerCompany: "Ironwood Roasters",
        date: "2025-06-04",
        rating: 5,
        text:
          "Onboarding was thorough. Took 5 weeks but everything worked on day one.",
        verified: true,
        helpful: 11,
      },
      {
        reviewerName: "Erin McGowan",
        reviewerCompany: "Saltbreeze Naturals",
        date: "2025-04-19",
        rating: 4,
        text:
          "Boring and reliable. That's a compliment for a 3PL.",
        verified: true,
        helpful: 12,
      },
    ],
    ratingBreakdown: { 5: 142, 4: 84, 3: 22, 2: 10, 1: 5 },

    country: "USA",
    state: "illinois",
    stateFullName: "Illinois",
    city: "chicago",
    cityFullName: "Chicago",
    servedStates: ["illinois", "ohio", "pennsylvania", "new-york", "georgia", "texas", "california", "florida"],
    serviceCategories: ["dtc-fulfillment", "fba-prep-services", "b2b-freight", "returns-management", "kitting-and-assembly"],
  },
  {
    name: "Crestline Supply",
    slug: "crestline-supply",
    location: "London, UK",
    rating: 4.7,
    reviewCount: 88,
    services: ["DTC Fulfillment", "FBA Prep", "Returns"],
    verified: true,
    description:
      "Greater London 3PL focused on DTC apparel and home goods. Strong same-day inbound receiving for fast-moving brands shipping nationally.",
    logoPlaceholder: "CS",

    tagline: "Greater London DTC focused on apparel and home goods.",
    yearFounded: 2018,
    employeeCount: "60–90",
    coverGradient: "blue-indigo",
    countryCode: "GB",
    region: "Greater London",
    specialties: ["UK DTC", "Apparel", "Home Goods"],
    integrations: ["Shopify", "WooCommerce", "Amazon", "Magento"],
    certifications: ["ISO 9001"],
    minimumOrderVolume: "100",
    pricingModel: "Per-pick + storage, no monthly minimum",
    responseTime: "Under 2 hours",
    fulfillmentSpeed: "Same-day cutoff 4pm GMT",
    orderAccuracy: 99.5,
    yearsInBusiness: 7,
    activeBrandsServed: 64,
    contact: {
      phone: "+44 20 7555 0142",
      email: "hello@crestlinesupply.example",
      website: "https://crestlinesupply.example",
    },
    about: [
      "Crestline Supply opened in a 50,000 sqft facility in Park Royal, west London in 2018 to serve UK DTC brands frustrated with the larger 3PLs' minimum-volume requirements. Their pitch is simple: same-day inbound receiving, same-day shipping cutoff at 4pm GMT, no monthly minimums, and a single point of contact who knows your brand.",
      "Their 50,000 sqft facility serves 64 active brands, mostly apparel and home goods. Most onboard in under 2 weeks, and most stay for the long haul — Crestline's churn is roughly 6% annually.",
      "Crestline is the right partner for emerging UK DTC brands shipping 500–10,000 orders per month. They are explicitly not the right partner for high-volume operations or anyone needing multi-warehouse distribution.",
    ],
    detailedServices: [
      {
        name: "UK DTC Pick & Pack",
        description: "Domestic UK fulfillment with same-day 4pm GMT cutoff.",
        included: true,
      },
      {
        name: "Amazon UK FBA Prep",
        description: "FBA prep and FNSKU labeling for Amazon UK.",
        included: true,
      },
      {
        name: "Returns Processing",
        description: "UK returns with photo-documented disposition reporting.",
        included: true,
      },
      {
        name: "EU Distribution",
        description:
          "Limited EU distribution available; not their primary specialty.",
        included: false,
      },
    ],
    warehouses: [
      {
        city: "London, UK",
        address: "Park Royal Business Park, London NW10 7DR",
        sqft: 50000,
        hours: "Mon–Fri 7am–8pm GMT",
        services: ["DTC Fulfillment", "FBA Prep", "Returns"],
      },
    ],
    reviews: [
      {
        reviewerName: "James Whitcombe",
        reviewerCompany: "Birchgrove Apparel",
        date: "2026-03-26",
        rating: 5,
        text:
          "Smaller 3PL with the operational discipline of a much larger one. We've grown 4x with them and never had a service issue.",
        verified: true,
        helpful: 19,
      },
      {
        reviewerName: "Emma Northcott",
        reviewerCompany: "Stonebrook Home",
        date: "2026-02-10",
        rating: 5,
        text:
          "Same-day inbound receiving means our marketing launches don't get blocked by the warehouse anymore.",
        verified: true,
        helpful: 13,
      },
      {
        reviewerName: "Alasdair Ross",
        reviewerCompany: "Caldwell Provisions",
        date: "2025-12-30",
        rating: 4,
        text:
          "Excellent UK ops. EU is limited so we use a separate partner for that.",
        verified: true,
        helpful: 7,
      },
      {
        reviewerName: "Priya Joshi",
        reviewerCompany: "Lavenden Beauty",
        date: "2025-11-12",
        rating: 5,
        text:
          "Single point of contact who actually knows our brand is rare in this industry.",
        verified: true,
        helpful: 11,
      },
      {
        reviewerName: "Robbie Marsh",
        reviewerCompany: "Halegrove Mens",
        date: "2025-09-22",
        rating: 4,
        text:
          "Pricing is fair for the size of brand we are. They've been transparent about what they can't do well, which I respect.",
        verified: false,
        helpful: 4,
      },
      {
        reviewerName: "Iona Kerr",
        reviewerCompany: "Foxholme Naturals",
        date: "2025-08-04",
        rating: 5,
        text:
          "Returns photo documentation has helped us reduce repeat returns from the same SKUs.",
        verified: true,
        helpful: 8,
      },
      {
        reviewerName: "Niall Gareth",
        reviewerCompany: "Pinewald Outdoor",
        date: "2025-06-18",
        rating: 5,
        text:
          "Onboarded in 8 days. Live and shipping by day 9. Crestline knows what they're doing.",
        verified: true,
        helpful: 10,
      },
      {
        reviewerName: "Catherine Burrows",
        reviewerCompany: "Ashfield Goods",
        date: "2025-05-02",
        rating: 5,
        text:
          "Great for emerging UK DTC. Wouldn't trade them for a bigger 3PL.",
        verified: true,
        helpful: 9,
      },
    ],
    ratingBreakdown: { 5: 56, 4: 24, 3: 5, 2: 2, 1: 1 },

    country: "UK",
    state: "england",
    stateFullName: "England",
    city: "london",
    cityFullName: "London",
    servedStates: ["england", "scotland"],
    serviceCategories: ["dtc-fulfillment", "fba-prep-services", "returns-management"],
  },
  {
    name: "Fairwind Logistics",
    slug: "fairwind-logistics",
    location: "Miami, FL",
    rating: 4.5,
    reviewCount: 134,
    services: ["DTC Fulfillment", "FBA Prep", "Cross-Border"],
    verified: true,
    description:
      "Southeast 3PL with cross-border Latin America and Caribbean flows and competitive 2-day Eastern US coverage.",
    logoPlaceholder: "FW",

    tagline: "Miami 3PL with cross-border Latin America flows and Eastern US 2-day reach.",
    yearFounded: 2014,
    employeeCount: "120–160",
    coverGradient: "navy-amber",
    countryCode: "US",
    region: "Florida",
    specialties: ["Cross-Border Latin America", "Southeast DTC", "Caribbean Distribution"],
    integrations: ["Shopify", "Amazon", "BigCommerce", "ShipStation"],
    certifications: ["ISO 9001", "C-TPAT"],
    minimumOrderVolume: "100",
    pricingModel: "Per-pick + storage, custom for cross-border Latin America",
    responseTime: "Under 3 hours",
    fulfillmentSpeed: "Same-day cutoff 3pm MT",
    orderAccuracy: 99.4,
    yearsInBusiness: 11,
    activeBrandsServed: 132,
    contact: {
      phone: "+1 (305) 555-0188",
      email: "hello@fairwindlogistics.example",
      website: "https://fairwindlogistics.example",
    },
    about: [
      "Fairwind Logistics opened in Miami in 2014 with a thesis: cross-border Latin America and Caribbean is underserved by US 3PLs, and Southeast brands often pay too much for inland warehousing in Atlanta. Miami offers proximity to Latin American markets, port and airport access for Caribbean cargo, and competitive 2-day reach across the Eastern US.",
      "Their 130,000 sqft facility serves 132 active brands. Roughly 30% of their volume is cross-border Latin America and Caribbean, which they handle via a dedicated bilingual team and an established broker relationship at PortMiami and MIA cargo terminals.",
      "Fairwind is a good fit for brands with Latin America or Caribbean aspirations and Eastern US customer concentrations. They are not the best choice if your customer base is West Coast — that adds a transit day vs. California or Midwest 3PLs.",
    ],
    detailedServices: [
      {
        name: "DTC Pick & Pack",
        description:
          "Standard DTC fulfillment with West Coast 2-day coverage.",
        included: true,
      },
      {
        name: "Cross-Border Latin America",
        description:
          "Consolidated DDP shipments into Mexico, the Caribbean, and Central / South America via PortMiami and MIA airfreight, customs cleared.",
        included: true,
      },
      {
        name: "FBA Prep",
        description: "FNSKU labeling and FBA injection for Amazon US.",
        included: true,
      },
      {
        name: "Spanish-Language Support",
        description:
          "Bilingual customer service handoffs for Latin America- and Caribbean-bound orders.",
        included: true,
      },
      {
        name: "Returns Processing",
        description: "Returns with disposition reporting.",
        included: false,
      },
    ],
    warehouses: [
      {
        city: "Miami, FL",
        address: "10500 NW 25th St, Doral, FL 33172",
        sqft: 130000,
        hours: "Mon–Sat 5am–10pm ET",
        services: ["DTC Fulfillment", "FBA Prep", "Cross-Border Latin America"],
      },
    ],
    reviews: [
      {
        reviewerName: "Lucia Mendoza",
        reviewerCompany: "Caracol Beauty",
        date: "2026-04-04",
        rating: 5,
        text:
          "Cross-border Latin America has been a 30% growth lever for us. Fairwind makes it operationally boring, which is what you want.",
        verified: true,
        helpful: 26,
      },
      {
        reviewerName: "Trent Kovac",
        reviewerCompany: "Coral Crest Outdoor",
        date: "2026-02-26",
        rating: 5,
        text:
          "Eastern US 2-day from Miami is real. Competitive with anyone in Atlanta at lower cost and faster Caribbean access.",
        verified: true,
        helpful: 18,
      },
      {
        reviewerName: "Annika Voss",
        reviewerCompany: "Saltrose Wellness",
        date: "2026-01-14",
        rating: 4,
        text:
          "Strong on Eastern US and Caribbean. West Coast is fine but adds a day vs. our previous Texas 3PL.",
        verified: true,
        helpful: 8,
      },
      {
        reviewerName: "Hector Luna",
        reviewerCompany: "Casita Goods",
        date: "2025-11-30",
        rating: 5,
        text:
          "Bilingual customer service handoffs are a real differentiator for our Latin America customers.",
        verified: true,
        helpful: 14,
      },
      {
        reviewerName: "Reed Carmichael",
        reviewerCompany: "Cactusridge Mens",
        date: "2025-10-08",
        rating: 4,
        text:
          "Pricing is competitive. Reporting could be more modern.",
        verified: false,
        helpful: 5,
      },
      {
        reviewerName: "Sierra Holm",
        reviewerCompany: "Greycliff Naturals",
        date: "2025-08-22",
        rating: 5,
        text:
          "Onboarded our Latin America expansion in 6 weeks including broker setup. Smooth.",
        verified: true,
        helpful: 11,
      },
      {
        reviewerName: "Brandon Yates",
        reviewerCompany: "Coastline Goods",
        date: "2025-06-29",
        rating: 4,
        text:
          "Solid 3PL with a regional specialty that genuinely helps Southeast and Caribbean-focused brands.",
        verified: true,
        helpful: 6,
      },
      {
        reviewerName: "Marisol Esposito",
        reviewerCompany: "Verdejo Apparel",
        date: "2025-05-04",
        rating: 5,
        text:
          "Pick accuracy on our small SKU catalog has been excellent.",
        verified: true,
        helpful: 7,
      },
    ],
    ratingBreakdown: { 5: 76, 4: 38, 3: 12, 2: 5, 1: 3 },

    country: "USA",
    state: "florida",
    stateFullName: "Florida",
    city: "miami",
    cityFullName: "Miami",
    servedStates: ["florida", "georgia", "texas", "california", "new-york"],
    serviceCategories: ["dtc-fulfillment", "fba-prep-services", "cross-border-fulfillment", "cold-storage"],
  },
];

// ---------------------------------------------------------------------------
// Categories, locations, stats, chips
// ---------------------------------------------------------------------------

export const categories: Category[] = [
  {
    name: "FBA Prep",
    slug: "fba-prep-services",
    description: "Amazon-compliant prep, labeling, and inbound logistics.",
    partnerCount: 142,
    iconKey: "package",
  },
  {
    name: "DTC Fulfillment",
    slug: "dtc-fulfillment",
    description: "Pick, pack, and ship for direct-to-consumer brands.",
    partnerCount: 218,
    iconKey: "truck",
  },
  {
    name: "Cold Storage",
    slug: "cold-storage",
    description: "Refrigerated and frozen storage with temp-controlled freight.",
    partnerCount: 38,
    iconKey: "snowflake",
  },
  {
    name: "B2B Freight",
    slug: "b2b-freight",
    description: "LTL, FTL, and retailer-compliant pallet shipping.",
    partnerCount: 84,
    iconKey: "warehouse",
  },
  {
    name: "Returns",
    slug: "returns-management",
    description: "Reverse logistics, inspection, and reconditioning.",
    partnerCount: 67,
    iconKey: "rotate",
  },
  {
    name: "Kitting",
    slug: "kitting-and-assembly",
    description: "Custom assembly, bundling, and subscription box builds.",
    partnerCount: 91,
    iconKey: "boxes",
  },
  {
    name: "Cross-Border",
    slug: "cross-border-fulfillment",
    description: "International shipping, customs, and duty management.",
    partnerCount: 52,
    iconKey: "globe",
  },
  {
    name: "Subscription Boxes",
    slug: "subscription-box-fulfillment",
    description: "Monthly cadence assembly, custom dunnage, and inserts.",
    partnerCount: 54,
    iconKey: "boxes",
  },
];

export const locations: Location[] = [
  {
    country: "United States",
    slug: "usa",
    flag: "US",
    partnerCount: 312,
    cities: 38,
  },
  {
    country: "Canada",
    slug: "canada",
    flag: "CA",
    partnerCount: 94,
    cities: 9,
  },
  {
    country: "United Kingdom",
    slug: "uk",
    flag: "GB",
    partnerCount: 67,
    cities: 7,
  },
];

export const stats: Stat[] = [
  { label: "Vetted Partners", value: 500, suffix: "+" },
  { label: "Cities Covered", value: 50, suffix: "+" },
  { label: "Verified Reviews", value: 12400, suffix: "+" },
  { label: "Response Rate", value: 98, suffix: "%" },
];

export const popularSearchChips = [
  "FBA Prep",
  "DTC Fulfillment",
  "Cold Storage",
  "B2B Freight",
  "Returns",
  "Kitting",
];

// Quick-filter chips for the directory page (8 items)
export const directoryQuickFilters = [
  "FBA Prep",
  "DTC Fulfillment",
  "Cold Storage",
  "B2B Freight",
  "Returns",
  "Kitting",
  "Subscription Boxes",
  "Cross-Border",
];

// Filter taxonomies for the sidebar
export type ServiceFilter = { name: string; count: number };

export const serviceFilters: ServiceFilter[] = [
  { name: "FBA Prep", count: 142 },
  { name: "DTC Fulfillment", count: 218 },
  { name: "Cold Storage", count: 38 },
  { name: "B2B Freight", count: 84 },
  { name: "Returns", count: 67 },
  { name: "Kitting", count: 91 },
  { name: "Subscription Boxes", count: 54 },
  { name: "Cross-Border", count: 52 },
  { name: "Heavy & Bulky", count: 29 },
  { name: "Container Drayage", count: 41 },
];

export const integrationFilters = [
  "Shopify",
  "Amazon",
  "WooCommerce",
  "BigCommerce",
  "NetSuite",
  "Magento",
];

export const certificationFilters = [
  "ISO 9001",
  "FDA Registered",
  "SOC 2",
  "GMP",
  "C-TPAT",
];

export const usStates = [
  "California",
  "Texas",
  "New York",
  "Florida",
  "Illinois",
  "Pennsylvania",
  "Georgia",
  "Ohio",
];

export const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "newest", label: "Newest" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find((p) => p.slug === slug);
}

export function getSimilarPartners(slug: string, count = 3): Partner[] {
  const target = getPartnerBySlug(slug);
  if (!target) return partners.slice(0, count);
  const overlapScore = (p: Partner) => {
    const s = new Set(target.services);
    return p.services.filter((x) => s.has(x)).length;
  };
  return partners
    .filter((p) => p.slug !== slug)
    .sort((a, b) => overlapScore(b) - overlapScore(a))
    .slice(0, count);
}

export function coverGradientCss(g: CoverGradient): string {
  switch (g) {
    case "navy-blue":
      return "linear-gradient(135deg, #0c1e3e 0%, #1d4ed8 100%)";
    case "navy-amber":
      return "linear-gradient(135deg, #0c1e3e 0%, #f59e0b 100%)";
    case "blue-indigo":
      return "linear-gradient(135deg, #1d4ed8 0%, #312e81 100%)";
  }
}

// ---------------------------------------------------------------------------
// Phase 1C SEO query helpers
// ---------------------------------------------------------------------------

export function getPartnersByCategory(categorySlug: string): Partner[] {
  return partners.filter((p) => p.serviceCategories.includes(categorySlug));
}

export function getPartnersByCountry(country: CountryName): Partner[] {
  return partners.filter((p) => p.country === country);
}

export function getPartnersByState(stateSlug: string): Partner[] {
  return partners.filter((p) => p.servedStates.includes(stateSlug));
}

export function getPartnersByCity(citySlug: string): Partner[] {
  return partners.filter((p) => p.city === citySlug);
}

export function getPartnersByCategoryAndState(
  categorySlug: string,
  stateSlug: string
): Partner[] {
  return partners.filter(
    (p) =>
      p.serviceCategories.includes(categorySlug) &&
      p.servedStates.includes(stateSlug)
  );
}

export function getStatePartnerCount(stateSlug: string): number {
  return getPartnersByState(stateSlug).length;
}

export function getCityPartnerCount(citySlug: string): number {
  return getPartnersByCity(citySlug).length;
}

export function getCategoryPartnerCount(categorySlug: string): number {
  return getPartnersByCategory(categorySlug).length;
}
