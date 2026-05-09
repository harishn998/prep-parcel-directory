/**
 * Phase 1C taxonomy: categories, locations, and per-combo editorial content.
 *
 * All copy in this file is original. Combo blurbs (categoryStateContexts) are
 * unique per (category, state) pair so combo pages don't trip thin/duplicate
 * content penalties. Slugs are the SEO-canonical URL fragments.
 */

import type { CategoryIconKey } from "./static-data";
import type { CountryName } from "./data/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Faq = { question: string; answer: string };

export type Category = {
  slug: string;
  name: string;
  description: string; // 1-line, used in meta + headers
  iconKey: CategoryIconKey;
  longDescription: [string, string, string]; // 3 paragraphs
  faqs: Faq[]; // 5 FAQs
};

export type City = {
  slug: string;
  name: string;
  description: string;
};

export type State = {
  slug: string;
  name: string;
  description: string;
  cities: City[];
};

export type Country = {
  slug: "usa" | "canada" | "uk";
  name: string;
  fullName: CountryName;
  description: [string, string]; // 2 paragraphs
  states: State[];
};

// ---------------------------------------------------------------------------
// Categories — 8 entries, each with 3-paragraph longDescription + 5 FAQs
// ---------------------------------------------------------------------------

export const CATEGORIES: Category[] = [
  {
    slug: "fba-prep-services",
    name: "FBA Prep Services",
    description:
      "FNSKU labeling, polybagging, bundling, and direct injection into Amazon fulfillment centers.",
    iconKey: "package",
    longDescription: [
      "FBA prep is the operational layer between your inbound containers and Amazon's fulfillment centers. Done right, it eliminates two-week delays at FCs, prevents stranded inventory, and cuts the long-tail damage rate that erodes Buy Box win rates. Done wrong, it costs sellers thousands per ASIN in remediation fees, removal orders, and lost sales velocity.",
      "Modern FBA prep partners handle FNSKU labeling, polybagging, bundling, expiration-date verification, hazmat compliance, and direct injection into Amazon FC networks via partnered carriers. The best operators run FBA prep on a parallel line to their DTC operation, which means cross-utilization of staff and same-campus pickup for sellers who need both channels under one roof.",
      "Pricing is typically per-unit prep plus carrier-rate-shopped freight. Sellers shipping under 1,000 units a month often find the unit economics cleanest with a regional 3PL; sellers moving full container loads benefit from port-adjacent partners who can drayage and prep on a single campus, eliminating the inland leg entirely.",
    ],
    faqs: [
      {
        question: "How long does FBA prep usually take from receipt to FC injection?",
        answer:
          "Quality 3PLs turn FBA prep in 24–48 hours from inbound dock to FNSKU-labeled, polybagged, FC-bound shipment. Slower 3PLs run on 5–7 day cycles, which silently kills your inbound velocity during launches and Q4.",
      },
      {
        question: "What's the difference between FBA prep and FBM fulfillment?",
        answer:
          "FBA prep means your 3PL labels and prepares inventory for shipment INTO Amazon's FCs — Amazon handles the customer-facing fulfillment. FBM means the 3PL fulfills Amazon orders directly to the customer. Most established sellers use both: FBA for bulk velocity, FBM as a backup when FBA inventory runs thin.",
      },
      {
        question: "Do FBA prep partners handle hazmat and oversized SKUs?",
        answer:
          "Most do, but only with appropriate certifications and direct relationships with Amazon's hazmat team. Confirm explicitly: not every prep partner handles batteries, aerosols, or oversized items, and Amazon's compliance windows are unforgiving.",
      },
      {
        question: "How are FBA prep services typically priced?",
        answer:
          "Per-unit handling charges (FNSKU label, polybag, case-pack) plus storage and outbound freight to FCs. Most credible 3PLs publish a public per-unit rate card. Watch for opaque pricing models that bury freight markups inside the prep fee.",
      },
      {
        question: "What happens if Amazon rejects my inbound shipment?",
        answer:
          "Quality 3PLs document every PO with photos and case-pack manifests, which lets you contest rejections quickly. Look for partners who handle the Amazon Seller Central case for you and pay re-prep fees themselves when the rejection is on their work.",
      },
    ],
  },
  {
    slug: "dtc-fulfillment",
    name: "DTC Fulfillment",
    description:
      "Pick, pack, and ship for direct-to-consumer brands across Shopify, BigCommerce, and beyond.",
    iconKey: "truck",
    longDescription: [
      "DTC fulfillment is the most-fought-over service in 3PL — every operator claims they do it well, only a small fraction actually do. The difference is invisible at low volume and brutal at scale: SKU-level pick accuracy, same-day cutoff discipline, branded-packaging consistency, and customer service handoffs that don't make your support team apologize for the warehouse.",
      "The best DTC partners integrate directly with Shopify, BigCommerce, WooCommerce, and Amazon Seller Central, sync inventory every 15 minutes, and offer same-day shipping cutoffs at 3pm or later in their local time zone. Two-day ground from a centrally located 3PL reaches 90%+ of the US population, which is why Midwest and East Coast hubs have a routing advantage over coastal-only operations.",
      "Pricing usually combines per-pick fees, packaging materials, and storage. Volume discounts kick in around 5,000 orders per month for most national 3PLs. Boutique 3PLs handle premium and editorial brands at 200–2,000 orders per month with white-glove packaging consistency the volume operators can't match.",
    ],
    faqs: [
      {
        question: "What's a realistic shipping cutoff for DTC orders?",
        answer:
          "Quality DTC 3PLs hold a same-day cutoff at 3pm to 5pm local time. If a 3PL claims a 'same-day' cutoff but in practice ships next-day during peak, your customer experience suffers — and tickets pile up at customer service.",
      },
      {
        question: "Should I use one DTC partner or split across regions?",
        answer:
          "Single-partner is operationally simpler and gives better unit economics until you cross 30,000 orders/month. Above that, splitting between an East Coast and West Coast 3PL cuts ground transit by a day for half your customer base, which moves conversion meaningfully.",
      },
      {
        question: "Can a DTC 3PL handle subscription boxes?",
        answer:
          "Some can, most can't well. Subscription assembly with custom dunnage, tissue paper, and inserts is a craft, not a generic pick-and-pack. Look for 3PLs that specialize in subscription explicitly — generalists tend to drop the unboxing quality at scale.",
      },
      {
        question: "What integrations should I expect from a modern DTC 3PL?",
        answer:
          "Native Shopify or BigCommerce sync (not via a third-party connector), order management dashboard, returns portal, and webhooks for shipment events. Bonus: native ShipStation, Recharge (subscription), and Klaviyo (CSAT data) integrations.",
      },
      {
        question: "How fast can I onboard with a DTC partner?",
        answer:
          "Two to four weeks for established 3PLs with mature onboarding playbooks. Slower if you have complex packaging, custom inserts, or need EDI for retail compliance. Demand a written onboarding plan with named owners on both sides — without it, transitions slip by months.",
      },
    ],
  },
  {
    slug: "cold-storage",
    name: "Cold Storage",
    description:
      "Refrigerated and frozen storage with temperature-controlled freight.",
    iconKey: "snowflake",
    longDescription: [
      "Cold storage 3PLs run an entirely different operational model from ambient warehousing: temperature monitoring at 5-minute intervals, sealed dock buffers, FDA registration, dedicated cold-chain freight relationships, and SOPs that account for power-loss contingencies. The capital expense per square foot is roughly 4× ambient, which is why specialized providers dominate the segment.",
      "Most cold storage 3PLs operate two zones — refrigerated (35–55°F) for produce, dairy, beverage, and most pharma; frozen (–10°F or lower) for proteins and ice cream. A few add a controlled-ambient zone (60–70°F) for chocolate, confectionery, and cosmetics. The right fit depends on your specific product temperature spec, not just the broad categories.",
      "Pricing is volumetric (per pallet day) plus handling and outbound freight. Cold-chain freight costs 30–60% more than ambient because trucks need refrigeration units running continuously. Brands serving retail need to confirm their 3PL supports the routing guides of their retail customers — Walmart, Costco, and Whole Foods have very different cold-chain compliance requirements.",
    ],
    faqs: [
      {
        question: "What temperature ranges do cold storage 3PLs support?",
        answer:
          "Most operate refrigerated (35–55°F) and frozen (–10°F or lower) zones. A subset offer controlled-ambient (60–70°F). Always confirm the specific range for your SKU — 'refrigerated' covers a wide band, and chocolate failing at 70°F is a different problem than yogurt failing at 55°F.",
      },
      {
        question: "Is cold-chain freight more expensive than ambient?",
        answer:
          "Yes — typically 30–60% more for parcel and 20–40% more for LTL. Refrigerated trucks have higher fixed costs (the reefer unit runs continuously) and tighter capacity. Build this into your unit economics before launching cold-chain DTC.",
      },
      {
        question: "Do I need FDA registration to use a cold storage 3PL?",
        answer:
          "Your 3PL needs FDA registration to handle most food and beverage SKUs. You may need separate registration depending on whether you're a manufacturer, distributor, or holder. A good cold-chain 3PL will guide you through their compliance umbrella.",
      },
      {
        question: "What happens if there's a power loss?",
        answer:
          "Quality cold-chain 3PLs have backup generators, redundant power feeds, and SOPs that move inventory to alternate facilities within hours. Confirm what 'backup' means specifically: a generator that runs for 4 hours is very different from one that runs for 72.",
      },
      {
        question: "Can a cold storage partner also handle DTC orders?",
        answer:
          "A few do, but most cold storage operations are wholesale-first and DTC pick-pack adds operational complexity (smaller orders, more frequent picks, parcel-rate freight). If you need both, prioritize 3PLs explicitly running cold DTC as a core service, not as an afterthought.",
      },
    ],
  },
  {
    slug: "b2b-freight",
    name: "B2B Freight",
    description:
      "LTL, FTL, and retailer-compliant pallet shipping.",
    iconKey: "warehouse",
    longDescription: [
      "B2B freight covers everything from pallet-quantity LTL into independent retailers up to full-truckload programs into Walmart, Target, Costco, and Amazon Vendor Central. The 3PL's job is multi-faceted: routing-guide compliance, EDI/ASN/856 transactions, case-conformance pack to retailer specs, and labeling that survives the receiving dock.",
      "Retail compliance is unforgiving. Chargebacks for incorrect routing, missing ASNs, or non-conformant pallets eat 2–5% of invoice value at best, and put your account at risk at worst. Quality B2B 3PLs run dedicated compliance teams that have already onboarded with the major retailers and know each routing guide's edge cases by heart.",
      "Pricing combines per-pallet handling, freight pass-through, and a compliance services fee for EDI and routing. Brands moving fewer than 50 pallets per month are usually better served by a generalist 3PL with retail support; brands moving 200+ pallets monthly should evaluate dedicated B2B operators with deeper carrier relationships and lower freight rates.",
    ],
    faqs: [
      {
        question: "What's the difference between LTL and FTL freight?",
        answer:
          "LTL (less-than-truckload) consolidates multiple shippers' freight on the same trailer — cheaper per pallet but slower with more handling touches. FTL (full truckload) is your freight only — faster, fewer damages, but higher minimum cost. Most retail programs use LTL until you hit ~12 pallets per shipment.",
      },
      {
        question: "Do B2B 3PLs handle EDI for me?",
        answer:
          "Quality ones do — they have established EDI mappings to Walmart, Target, Costco, Whole Foods, and other major retailers. Setup typically takes 4–6 weeks per retailer. Avoid 3PLs that ask you to maintain your own EDI translation; that's a cost shift, not a service.",
      },
      {
        question: "What are routing guides and why do they matter?",
        answer:
          "Routing guides are each retailer's specific compliance rules: which carriers to use, how to label pallets, when to ship, what documentation must accompany the load. Non-compliance triggers chargebacks (2–5% of invoice). Good 3PLs maintain current routing-guide playbooks for every retailer you ship to.",
      },
      {
        question: "Can the same 3PL handle B2B and DTC under one roof?",
        answer:
          "Some can — typically larger 3PLs with parallel operations. The benefit is shared inventory between channels. The risk is that one operation gets prioritized during peak, usually B2B (because retailer chargebacks are bigger). Confirm explicitly how the 3PL handles channel conflicts.",
      },
      {
        question: "How do chargebacks work with B2B 3PLs?",
        answer:
          "Retailers issue chargebacks for non-compliance, deducted from your invoice. Your 3PL should track these, attribute root cause (their fault vs yours vs the retailer's), and absorb the cost when it's their operational error. A 3PL that pushes every chargeback to you regardless of cause isn't worth keeping.",
      },
    ],
  },
  {
    slug: "returns-management",
    name: "Returns Management",
    description:
      "Reverse logistics, inspection, and reconditioning with disposition reporting.",
    iconKey: "rotate",
    longDescription: [
      "Returns are the most under-engineered part of most DTC stacks — and the most expensive. The average e-commerce return costs 25–30% of the original order value when you account for inbound freight, inspection labor, restocking, refund processing, and the lost margin on items that can't be resold at full price. A serious returns 3PL turns this from a cost center into a margin recovery program.",
      "Quality returns management combines a customer-facing returns portal (with prepaid label generation), inbound consolidation, item-by-item inspection with photo documentation, disposition routing (restock, liquidate, refurbish, dispose), and analytics that surface SKU-level return reasons. The best operators reduce repeat returns on the same SKU by 40%+ in the first year by feeding inspection findings back to product teams.",
      "Pricing combines a per-return handling fee, inspection labor, and disposition costs. Liquidation channel relationships matter — 3PLs with established secondary-market buyers can recover 20–40% of original value on items that would otherwise hit the dumpster. Ask for the partner's average recovery rate by category before signing.",
    ],
    faqs: [
      {
        question: "What's a typical cost per return?",
        answer:
          "Inbound freight and handling alone runs $4–$12 per parcel; full inspection and disposition with photo documentation is typically $6–$15 on top. Total per-return cost (excluding the lost margin on liquidated items) is usually $10–$25 depending on item complexity and SKU value.",
      },
      {
        question: "How long does returns processing typically take?",
        answer:
          "From customer drop-off to refund issued: 5–10 business days at quality 3PLs. Faster turnaround correlates with customer-satisfaction scores and repeat purchase rates, so it's worth optimizing for.",
      },
      {
        question: "Can returns 3PLs help me reduce return rates?",
        answer:
          "Yes — by surfacing SKU-level return reasons (sizing issue, damaged in transit, didn't match product page, etc). Quality 3PLs deliver monthly disposition reports that correlate return reasons to SKUs and product page content. Use this data to fix root causes, not just process returns faster.",
      },
      {
        question: "What's the difference between restock, liquidate, and dispose?",
        answer:
          "Restock = item is in resellable condition and goes back into inventory. Liquidate = sold via secondary channels (B-stock, outlet, wholesale liquidator) at reduced price. Dispose = unsalvageable, written off. Quality 3PLs publish their disposition mix and recovery rates by category.",
      },
      {
        question: "Should I integrate returns with my customer support team?",
        answer:
          "Yes — returns insights drive customer support efficiency (sizing questions, common defects). Look for 3PLs that integrate with Gorgias, Zendesk, or Kustomer so support agents see return history when responding to tickets. This single integration tends to cut ticket-resolution time meaningfully.",
      },
    ],
  },
  {
    slug: "kitting-and-assembly",
    name: "Kitting & Assembly",
    description:
      "Custom assembly, bundling, and pre-built SKU creation at warehouse scale.",
    iconKey: "boxes",
    longDescription: [
      "Kitting takes raw inventory components and builds them into shippable SKUs — gift sets, starter kits, multi-pack bundles, subscription assemblies, retail display packs, and seasonal promotions. It's labor-intensive work that requires accurate component tracking, consistent build quality, and the operational discipline to scale a hand-finished process to thousands of units per day without quality drift.",
      "Quality kitting 3PLs operate a separate kitting line from standard pick-and-pack, with dedicated build stations, work-instruction documentation, and per-build quality checks. The best operators run kitting on flexible scheduling so brand launches and seasonal campaigns don't displace daily order flow on the parallel DTC line.",
      "Pricing is typically per-kit assembly plus components and packaging. Volume discounts kick in around 1,000 kits per build. For complex kits with 10+ components, expect $3–$8 per kit in assembly labor alone. Brands launching subscription boxes should specifically confirm their kitting partner's monthly cadence capacity — assembly is the choke point on most subscription operations.",
    ],
    faqs: [
      {
        question: "What's the difference between kitting and pick-and-pack?",
        answer:
          "Pick-and-pack pulls existing SKUs and ships them. Kitting builds NEW SKUs from components — combining items that arrive separately into a single sellable unit. Kitting requires component-level inventory tracking and dedicated assembly labor; pick-and-pack doesn't.",
      },
      {
        question: "How many components can a typical kit include?",
        answer:
          "Most 3PLs comfortably build 3–10 component kits at scale. Beyond 15 components, build time and error rates climb fast. If you're designing a complex kit, share the build spec with potential 3PLs early — many will object during onboarding rather than after the contract.",
      },
      {
        question: "Can kitting include custom dunnage and inserts?",
        answer:
          "Yes — and this is where boutique 3PLs earn their premium. Hand-tied ribbon, signed packing slips, custom tissue paper, and embossed inserts are standard at the higher tier. Generalist 3PLs typically can do these, but quality drift at scale is the risk.",
      },
      {
        question: "What's the lead time on a kitting build?",
        answer:
          "Standard 3–10 component kits build in 2–5 days from greenlight. Complex kits (10+ components, custom packaging) often need 1–2 weeks plus material lead time on packaging. Subscription boxes with monthly cadence are usually built in a single 36–48 hour window per cycle.",
      },
      {
        question: "Should I do kitting in-house or with a 3PL?",
        answer:
          "Below 500 kits per month, in-house can be cost-effective if you have warehouse space. Above 1,000 kits per month, the labor and quality-control complexity usually push you to a 3PL. Subscription brands should outsource from day one — the monthly cadence cliff is brutal.",
      },
    ],
  },
  {
    slug: "subscription-box-fulfillment",
    name: "Subscription Box Fulfillment",
    description:
      "Monthly cadence assembly with custom dunnage, inserts, and per-cycle build management.",
    iconKey: "boxes",
    longDescription: [
      "Subscription box fulfillment is its own discipline within DTC fulfillment. The model concentrates 80–90% of monthly volume into a 36–48 hour shipping window, which means the operational stress of an entire month happens in two days. 3PLs that handle subscription well plan capacity around this cadence; ones that don't end up missing ship dates and triggering customer-support floods.",
      "Beyond the cadence challenge, subscription boxes typically include custom packaging that defines the brand: signature dunnage, branded tissue, hand-tied ribbon, themed inserts, and rotating-component assembly. Quality at scale matters because subscribers compare unboxing experiences month-over-month — quality drift is one of the top three churn drivers in subscription.",
      "Pricing combines a monthly cadence assembly fee, per-box pick-and-pack, packaging materials, and outbound freight. Most subscription 3PLs minimum at 500 boxes/month. Above 5,000 boxes/month, expect tiered pricing with custom contract terms. Look for partners who guarantee 100% of subscriptions ship within a defined window — penalty clauses make this binding.",
    ],
    faqs: [
      {
        question: "Why is subscription fulfillment different from regular DTC?",
        answer:
          "Concentrated cadence. A subscription brand shipping 5,000 boxes per month ships them all in a 36–48 hour window — the same volume as 167 daily orders for a regular DTC brand, but compressed into two days. Most generalist 3PLs aren't staffed for this peak.",
      },
      {
        question: "Can I customize my box's packaging at scale?",
        answer:
          "Yes — quality subscription 3PLs handle custom dunnage, tissue, ribbon, and insert assembly without quality drift up to ~10,000 boxes/month. Beyond that, pricing favors more standardized packaging. Subscriptions with editorial-quality unboxing usually cap at 5,000–8,000 boxes per cycle.",
      },
      {
        question: "How are subscription components sourced and stored?",
        answer:
          "Most subscription brands ship components to the 3PL 1–2 weeks ahead of build, with the 3PL handling per-cycle inventory tracking. Look for 3PLs with strong inbound receiving SLAs (24–48 hour dock-to-availability) — slow inbound delays the build window.",
      },
      {
        question: "What happens if a component arrives late or short?",
        answer:
          "Quality subscription 3PLs have escalation playbooks: substitute SKU, partial shipment with backorder, or reschedule the build. Confirm the playbook upfront. The worst outcome is silent missed components going out in subscriber boxes — a churn nightmare.",
      },
      {
        question: "Should subscription boxes ship from a centrally located 3PL?",
        answer:
          "Yes — Midwest and East Coast hubs reach 90%+ of US subscribers in 2-day ground. West Coast-only 3PLs cost subscribers an extra day, which compounds quickly when boxes ship in waves. Customer-support tickets about late boxes correlate strongly with shipping origin.",
      },
    ],
  },
  {
    slug: "cross-border-fulfillment",
    name: "Cross-Border Fulfillment",
    description:
      "International shipping, customs, and duty management for DTC brands expanding globally.",
    iconKey: "globe",
    longDescription: [
      "Cross-border fulfillment is one of the highest-leverage growth moves for DTC brands — expanding into Canada, the EU, the UK, or Latin America can add 15–30% to revenue without proportional cost. The catch: customs, duties, IOSS, OSS, returns, and currency rules are operationally non-trivial, and getting them wrong damages margin and customer experience simultaneously.",
      "Quality cross-border 3PLs handle the complete operational layer: DDP (delivered duty paid) shipping with duties prepaid by the brand, IOSS or OSS registration for EU shipments, broker relationships at the relevant border crossings, and consolidated returns processing for cost efficiency. Some specialize in specific corridors: US ↔ Canada, US ↔ EU, UK ↔ EU post-Brexit, US ↔ Latin America.",
      "Pricing typically combines a cross-border handling fee per shipment, duty pass-through, and freight rates that reflect the international leg. The economics improve with consolidation — 3PLs that ship daily into Canada via consolidated entries achieve much lower per-parcel customs costs than ones running individual entries.",
    ],
    faqs: [
      {
        question: "What is DDP shipping and why does it matter?",
        answer:
          "DDP (Delivered Duty Paid) means duties and taxes are calculated and paid by your brand at checkout, so customers receive their package without surprise customs charges. DDP shipping converts at 2–3× the rate of DDU (where customers pay duties on delivery). It's the modern cross-border standard.",
      },
      {
        question: "Do I need IOSS or OSS for EU shipments?",
        answer:
          "Yes if you're shipping to EU consumers under €150 — IOSS (Import One-Stop Shop) lets you collect VAT at checkout and avoid customs delays at the border. OSS handles intra-EU sales above €10k. Without these, your EU shipments hit individual customs review and customer experience suffers.",
      },
      {
        question: "How does cross-border shipping into Canada work?",
        answer:
          "From the US, the cleanest model is consolidated DDP via a 3PL with a Canadian customs broker relationship. Per-parcel duties are calculated upfront, paid by the brand, and the package crosses the border in a consolidated daily entry. Customer receives the package as a standard domestic-feeling delivery.",
      },
      {
        question: "What about cross-border returns?",
        answer:
          "Returns are the hardest part. Best practice is consolidated return handling — Canadian or EU customers ship returns to a domestic-country address, the 3PL aggregates and processes them, then ships net inventory back to the original origin in bulk. Saves 80%+ of return-shipping cost vs individual returns.",
      },
      {
        question: "Is cross-border fulfillment worth it for small DTC brands?",
        answer:
          "Yes — even at 1,000 international orders/month, the revenue lift typically pays for the operational complexity. The bigger question is corridor selection: pick one corridor (US-Canada or US-EU) to nail before expanding to multiple. Most brands try to do all corridors at once and underdeliver on each.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Locations — 3 countries × 13 states × 10 cities
// ---------------------------------------------------------------------------

export const COUNTRIES: Country[] = [
  {
    slug: "usa",
    name: "USA",
    fullName: "USA",
    description: [
      "The United States is the world's largest 3PL market by spend, with mature warehousing infrastructure across every region. Coastal hubs (Los Angeles, New York / New Jersey, Miami) anchor port-adjacent operations and importer flows; Midwest hubs (Chicago, Columbus, Indianapolis) anchor the distribution ring that reaches 90%+ of US households in 2-day ground. The Sun Belt (Atlanta, Dallas, Phoenix) has emerged as a high-growth alternative thanks to lower real-estate costs and proximity to the Southeast and Latin American markets.",
      "Most national DTC brands operate from a single Midwest or East Coast hub for 2-day ground reach, and add a West Coast partner above 30,000 monthly orders to compress transit by a day for half their customer base. B2B retail brands tend to operate near their primary retailers' distribution networks. Cold-chain operations cluster in Atlanta, Dallas, and Reno; FBA prep operations cluster in Long Beach, Houston, and Savannah for port adjacency.",
    ],
    states: [
      {
        slug: "california",
        name: "California",
        description:
          "California is North America's largest 3PL market, with major warehouse clusters in the Inland Empire (Riverside, San Bernardino), the Bay Area, and along the Long Beach / LA port complex. The state hosts the bulk of US Pacific imports and is the natural anchor for any brand serving the West Coast or moving Asian inventory through US ports.",
        cities: [
          {
            slug: "los-angeles",
            name: "Los Angeles",
            description:
              "Los Angeles is the dominant US import gateway via the Long Beach and LA port complex, which together handle roughly 35% of all US container imports. 3PLs in the LA basin specialize in port drayage, FBA prep on port-adjacent campuses, and West Coast DTC fulfillment with same-day cutoffs into Pacific time zones.",
          },
        ],
      },
      {
        slug: "texas",
        name: "Texas",
        description:
          "Texas combines major distribution hubs in Dallas-Fort Worth and Houston with cross-border Mexico operations along the Rio Grande. The state has lower warehouse real-estate costs than coastal markets, central-US 2-day ground reach into both coasts, and strong cold-chain infrastructure built around food and beverage exports.",
        cities: [
          {
            slug: "dallas",
            name: "Dallas",
            description:
              "Dallas-Fort Worth is the central-US distribution capital, with 2-day ground reach into both coasts, the Midwest, and the Southeast. Major rail intermodal terminals (BNSF Alliance, Union Pacific Dallas) feed the warehousing ring around DFW airport, making it the top choice for brands needing balanced national reach.",
          },
          {
            slug: "houston",
            name: "Houston",
            description:
              "Houston combines the second-largest US container port with direct overland access to Mexico via the I-35 / I-45 corridors. 3PLs here specialize in import handling, oil-and-gas industrial logistics, and cross-border Mexico flows, with growing DTC capacity for brands serving the Gulf Coast and Southwest.",
          },
        ],
      },
      {
        slug: "new-york",
        name: "New York",
        description:
          "New York combines port operations at the Port of NY/NJ (the largest East Coast container port) with dense distribution capacity in northern New Jersey serving the Mid-Atlantic and Northeast. 3PLs here specialize in import handling for fashion and lifestyle brands and same-day metro delivery to NYC, Boston, and Philadelphia.",
        cities: [
          {
            slug: "new-york-city",
            name: "New York City",
            description:
              "New York City and the surrounding NJ logistics belt is the East Coast's primary import gateway, handling ~12% of all US container traffic. Most NYC-area 3PLs operate from northern New Jersey rather than Manhattan or Brooklyn — boutique fulfillment for fashion and editorial brands does run from Brooklyn (notably Industry City) at a price premium.",
          },
        ],
      },
      {
        slug: "florida",
        name: "Florida",
        description:
          "Florida's logistics infrastructure is anchored by Miami (the primary US gateway to Latin America and the Caribbean), JaxPort, and Orlando's central distribution belt. 3PLs in Florida specialize in cross-border Latin America, Caribbean distribution, cold-chain produce flows, and Southeast US DTC.",
        cities: [
          {
            slug: "miami",
            name: "Miami",
            description:
              "Miami is the US's primary gateway to Latin America and the Caribbean, with PortMiami handling cargo for 100+ Caribbean and Central / South American destinations and MIA processing more international cargo than any US airport except JFK. 3PLs here specialize in cross-border DDP flows south, bilingual customer service, and Eastern US 2-day fulfillment.",
          },
        ],
      },
      {
        slug: "illinois",
        name: "Illinois",
        description:
          "Illinois — specifically the Chicago metro — is the central US's largest distribution hub, with rail intermodal terminals connecting Pacific and Atlantic coasts and 2-day ground reach into 95% of US households. The state hosts major operations for national 3PLs serving subscription, DTC, and B2B retail programs nationwide.",
        cities: [
          {
            slug: "chicago",
            name: "Chicago",
            description:
              "Chicago is the central US distribution capital, with the largest concentration of rail intermodal terminals in North America and 2-day ground reach into 95% of the continental US. Most national-scale DTC and subscription 3PLs operate from the Aurora / Joliet warehouse belt southwest of Chicago.",
          },
        ],
      },
      {
        slug: "pennsylvania",
        name: "Pennsylvania",
        description:
          "Pennsylvania's logistics infrastructure spans the Allentown-to-Philadelphia I-78 / I-95 corridor — one of the densest warehouse belts in North America — plus Pittsburgh's Western Pennsylvania manufacturing logistics base. The state offers strong East Coast 2-day reach and proximity to the major Northeast / Mid-Atlantic population centers.",
        cities: [
          {
            slug: "philadelphia",
            name: "Philadelphia",
            description:
              "Philadelphia anchors a major East Coast warehouse belt running up I-95 to the Lehigh Valley, with strong 2-day ground reach into the entire Northeast and Mid-Atlantic. The Port of Philadelphia handles significant produce and pharma cold-chain imports, and the metro hosts major operations for DTC and subscription 3PLs serving the Eastern US.",
          },
        ],
      },
      {
        slug: "georgia",
        name: "Georgia",
        description:
          "Georgia is the Southeast's distribution capital, anchored by the Port of Savannah (the fastest-growing East Coast container port) and Atlanta's airport / rail intermodal hub. 3PLs in the state handle B2B retail flows into Walmart, Costco, and Wayfair distribution networks, plus growing DTC and cold-chain operations.",
        cities: [
          {
            slug: "atlanta",
            name: "Atlanta",
            description:
              "Atlanta combines the busiest passenger airport in the world with major rail intermodal terminals from Savannah, making it the Southeast's primary distribution hub. 3PLs here specialize in retail compliance for major Southeast retailers (Home Depot, Lowe's, Wayfair), oversized DTC, and B2B freight programs.",
          },
        ],
      },
      {
        slug: "ohio",
        name: "Ohio",
        description:
          "Ohio's logistics infrastructure is anchored by Columbus (central distribution hub with strong 2-day reach), Cincinnati's CVG cargo airport, and the Cleveland-Akron belt for industrial logistics. The state offers some of the lowest warehouse real-estate costs east of the Mississippi and is a common location for subscription 3PLs.",
        cities: [],
      },
      {
        slug: "ontario",
        name: "Ontario",
        description:
          "Ontario hosts the bulk of Canadian eCommerce volume, with the Greater Toronto Area serving as the country's primary DTC and retail distribution hub. 3PLs in Ontario handle Amazon.ca FBA prep, cross-border US flows via the Buffalo / Detroit border crossings, and same-day metro delivery into Toronto, Mississauga, and Hamilton.",
        cities: [
          {
            slug: "toronto",
            name: "Toronto",
            description:
              "Toronto is Canada's largest 3PL market, with major warehouse clusters in Mississauga, Brampton, and Vaughan. 3PLs here serve Canadian DTC and Amazon.ca FBA and offer cross-border US flows via the Niagara / Buffalo crossings. Bilingual French / English customer service is standard for brands serving Quebec.",
          },
        ],
      },
      {
        slug: "british-columbia",
        name: "British Columbia",
        description:
          "British Columbia is Canada's western Pacific gateway, with Vancouver hosting the country's largest container port and a 3PL base specialized in US cross-border flows via the Pacific Highway / Blaine, Washington border. The province serves Canadian West Coast DTC plus growing Asian eCommerce inbound.",
        cities: [
          {
            slug: "vancouver",
            name: "Vancouver",
            description:
              "Vancouver is Canada's primary West Coast distribution hub, with the Port of Vancouver handling the country's largest share of Asian imports. 3PLs in the metro specialize in Canadian DTC, Amazon.ca FBA, and cross-border US flows via the Blaine, Washington bonded warehouse model.",
          },
        ],
      },
      {
        slug: "alberta",
        name: "Alberta",
        description:
          "Alberta — anchored by Calgary and Edmonton — is Canada's central plains logistics base, serving the Prairies and Western Canada. 3PLs here handle distribution for Western Canadian DTC, oil-and-gas industrial logistics, and growing Asian-route imports via Prince Rupert.",
        cities: [
          {
            slug: "calgary",
            name: "Calgary",
            description:
              "Calgary is the major distribution hub for Western Canada outside of Vancouver, with strong rail and trucking access to Prairie provinces and a developing DTC fulfillment base. Lower warehouse real-estate costs than Vancouver make it a viable secondary node for brands serving Alberta and Saskatchewan.",
          },
        ],
      },
      {
        slug: "england",
        name: "England",
        description:
          "England hosts the bulk of UK eCommerce logistics infrastructure, with major distribution hubs across the Midlands (Birmingham, Northampton), the M62 corridor (Manchester, Leeds), and Greater London. UK 3PLs handle domestic DTC, Amazon UK FBA, and cross-border EU flows via partnered Rotterdam or Antwerp facilities.",
        cities: [
          {
            slug: "london",
            name: "London",
            description:
              "Greater London hosts the UK's primary DTC fulfillment infrastructure outside of the Midlands, with major warehouse clusters around Park Royal, Heathrow, and the Dartford / Thames Gateway corridor. 3PLs here serve London-metro same-day delivery and act as the UK arm for European brands needing post-Brexit warehousing.",
          },
          {
            slug: "manchester",
            name: "Manchester",
            description:
              "Manchester is the largest 3PL hub in northern England, anchored by the Trafford Park industrial estate. Manchester-area 3PLs handle UK national DTC, Amazon UK FBA, and growing cross-border EU flows. The location offers strong M6 / M62 motorway reach into Scotland, Wales, and the Midlands.",
          },
        ],
      },
      {
        slug: "scotland",
        name: "Scotland",
        description:
          "Scotland's logistics infrastructure clusters in Glasgow's distribution belt and Edinburgh's eastern corridor. Scottish 3PLs serve Scottish DTC volume and act as the Northern UK fulfillment node for brands wanting same-day reach into Edinburgh, Glasgow, and Aberdeen without trucking from England.",
        cities: [],
      },
    ],
  },
  {
    slug: "canada",
    name: "Canada",
    fullName: "Canada",
    description: [
      "Canada is the world's tenth-largest eCommerce market, concentrated heavily in the Greater Toronto and Greater Vancouver areas. Cross-border US flows are the defining operational challenge for Canadian DTC brands — the right 3PL handles consolidated DDP entries, IOSS-equivalent customs paperwork, and bilingual French / English customer service for brands serving Quebec.",
      "Most Canadian 3PLs split their volume between Amazon.ca FBA prep, domestic DTC, and US cross-border. The strongest operators run dual-zone setups (Canada + a US-bonded warehouse near Buffalo or Blaine, WA) so brands can ship same-day to either market from one inventory pool.",
    ],
    states: [], // populated via cross-reference with COUNTRIES[0] etc — set later
  },
  {
    slug: "uk",
    name: "UK",
    fullName: "UK",
    description: [
      "The United Kingdom is one of Europe's largest eCommerce markets, with logistics infrastructure concentrated in the Midlands, Greater London, and the M62 corridor. Post-Brexit, UK 3PLs increasingly serve a dual role: domestic UK fulfillment plus the UK arm for EU brands needing post-Brexit warehousing.",
      "The strongest UK 3PLs offer cross-border EU flows via partnered Rotterdam or Antwerp facilities, IOSS-compliant duty handling, and same-day cutoffs at 4pm GMT for next-day Royal Mail and Evri delivery across England, Wales, and Scotland.",
    ],
    states: [],
  },
];

// Cross-reference: copy state data from COUNTRIES[0] (USA) into the per-country
// arrays. The above type allows empty arrays for non-USA temporarily; populated below.

// We wrote USA states inline. Populate Canada + UK now:
COUNTRIES[1].states = [
  COUNTRIES[0].states.find((s) => s.slug === "ontario")!,
  COUNTRIES[0].states.find((s) => s.slug === "british-columbia")!,
  COUNTRIES[0].states.find((s) => s.slug === "alberta")!,
];
COUNTRIES[2].states = [
  COUNTRIES[0].states.find((s) => s.slug === "england")!,
  COUNTRIES[0].states.find((s) => s.slug === "scotland")!,
];

// Now strip Canadian + UK states out of USA's list (they were nested there for
// initial declaration convenience — the routing logic expects the per-country
// states array to only contain that country's states).
COUNTRIES[0].states = COUNTRIES[0].states.filter(
  (s) =>
    !["ontario", "british-columbia", "alberta", "england", "scotland"].includes(
      s.slug
    )
);

// ---------------------------------------------------------------------------
// Per-state and per-country lookup helpers
// ---------------------------------------------------------------------------

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCountryBySlug(slug: string): Country | undefined {
  return COUNTRIES.find((c) => c.slug === slug);
}

export function getStateBySlug(stateSlug: string): State | undefined {
  for (const country of COUNTRIES) {
    const s = country.states.find((st) => st.slug === stateSlug);
    if (s) return s;
  }
  return undefined;
}

export function getCountryForState(
  stateSlug: string
): Country | undefined {
  return COUNTRIES.find((c) =>
    c.states.some((s) => s.slug === stateSlug)
  );
}

export function getCityBySlug(
  citySlug: string
): { country: Country; state: State; city: City } | undefined {
  for (const country of COUNTRIES) {
    for (const state of country.states) {
      const city = state.cities.find((c) => c.slug === citySlug);
      if (city) return { country, state, city };
    }
  }
  return undefined;
}

export function allStates(): State[] {
  return COUNTRIES.flatMap((c) => c.states);
}

export function allCities(): { country: Country; state: State; city: City }[] {
  return COUNTRIES.flatMap((c) =>
    c.states.flatMap((s) =>
      s.cities.map((city) => ({ country: c, state: s, city }))
    )
  );
}

// ---------------------------------------------------------------------------
// Combo blurbs — unique paragraph per (category × state) for combo pages
// Only states with ≥1 partner offering the category are populated. Combos
// without an entry here fall back to the category's first paragraph + the
// state's description (still unique per page — no Google-flag risk).
// ---------------------------------------------------------------------------

export const categoryStateContexts: Record<
  string,
  Record<string, string>
> = {
  "fba-prep-services": {
    california:
      "California's FBA prep market is the largest in North America, anchored by the LA / Long Beach port complex that handles roughly 35% of all US container imports. Brands shipping FNSKU-labeled inventory through California prep partners benefit from same-campus drayage and FC injection, eliminating the inland transportation leg that adds 5–10 days at coastal-only operations elsewhere.",
    texas:
      "Texas FBA prep hubs in Dallas and Houston combine central-US 2-day ground reach with Gulf Coast port access. Houston-area 3PLs offer the additional advantage of consolidated container drayage from Port Houston, which has grown faster than any other US port over the past five years on Gulf-routed Asian volume.",
    "new-york":
      "New York's FBA prep capacity sits primarily in northern New Jersey, serving the Port of NY/NJ — the largest East Coast container gateway. NY-area prep 3PLs are the natural choice for fashion, lifestyle, and pharma sellers whose FCs concentrate in the Northeast, where same-day prep-to-FC injection is achievable.",
    florida:
      "Florida FBA prep capacity in Miami and Jacksonville handles brands serving Southeast US Amazon FCs plus Caribbean and Latin American flows. The market is smaller than coastal California or NY/NJ but offers competitive pricing and proximity to PortMiami, which serves as the primary US-LATAM gateway.",
    illinois:
      "Illinois — specifically the Chicago / Aurora / Joliet warehouse belt — is one of the strongest national FBA prep markets thanks to its rail intermodal connections to both coasts. Brands moving inventory cross-country often find Illinois prep operations cheaper than coastal alternatives once you account for the inland leg into Amazon's Midwest FCs.",
    pennsylvania:
      "Pennsylvania's FBA prep capacity along the I-78 / I-81 / I-95 corridor between Philadelphia and the Lehigh Valley is the densest East Coast prep belt outside of NY/NJ. The market favors mid-volume FBA sellers — pricing is usually better than NY metro, with comparable injection speed into Northeast FCs.",
    georgia:
      "Georgia's FBA prep capacity is anchored by Savannah port operations and the Atlanta airport / rail hub. Savannah-area prep 3PLs handle brands moving inventory through the East Coast's fastest-growing port; Atlanta-based operators serve the Southeast distribution belt with strong reach into Georgia, Florida, and the Carolinas FCs.",
    ohio:
      "Ohio FBA prep operations — particularly in the Columbus / Cincinnati corridor — combine some of the lowest warehouse real-estate costs east of the Mississippi with strong central-US ground reach. Brands shipping under 2,000 units per month often find better unit economics here than at larger national prep operators.",
    ontario:
      "Ontario's Amazon.ca FBA prep market is concentrated in the Greater Toronto Area, with most operators handling both Canadian FBA prep and US cross-border flows from a single facility. Canadian brands selling on both Amazon.ca and Amazon.com find dual-channel prep here cleaner than running separate US and Canadian relationships.",
    "british-columbia":
      "British Columbia FBA prep operations in the Vancouver metro handle Amazon.ca inventory plus US cross-border flows through bonded warehouses on the Washington side of the Pacific Highway crossing. The dual-channel model is the defining capability of BC prep partners.",
    alberta:
      "Alberta's FBA prep capacity is smaller than Ontario or BC but has emerged as a viable secondary node for Western Canadian sellers. Calgary-area operators offer lower real-estate costs than Vancouver and clean ground reach into Saskatchewan and Manitoba.",
    england:
      "England's Amazon UK FBA prep market is anchored by the Midlands warehouse belt around Birmingham, Manchester, and Northampton. Quality prep operators handle FNSKU labeling for Amazon UK, polybagging to UK retail standards, and direct injection into Amazon's UK FCs with same-day cutoffs at 4pm GMT.",
    scotland:
      "Scotland's Amazon UK FBA prep capacity is more limited than the English Midlands but viable for sellers serving the Scottish market. Glasgow and Edinburgh-area operators offer competitive pricing for low-volume sellers and clean reach into the Northern UK FC network.",
  },
  "dtc-fulfillment": {
    california:
      "California's DTC fulfillment market is the largest in North America by both volume and operator count. Inland Empire warehouses serve LA, San Diego, and Bay Area metros with same-day ground; Bay Area boutique 3PLs handle premium and editorial DTC at lower volume but higher quality. The state is the natural primary node for any DTC brand with significant West Coast customer concentration.",
    texas:
      "Texas DTC fulfillment combines central-US 2-day ground reach into both coasts with lower warehouse real-estate costs than California or the Northeast. Dallas-Fort Worth is the dominant hub for national DTC operations; Houston serves brands wanting Gulf Coast presence and Mexico cross-border capability.",
    "new-york":
      "New York DTC fulfillment splits between high-velocity national operations in northern New Jersey and boutique editorial fulfillment in Brooklyn and Manhattan. NJ-side operators serve standard DTC at competitive rates; NY-side boutiques charge a premium for hand-finished packaging consistency that commodity 3PLs can't match.",
    florida:
      "Florida DTC fulfillment serves Southeast US customers with same-day cutoffs and 2-day ground into the Carolinas and Georgia. Miami-area 3PLs add cross-border Latin America and Caribbean capability — useful for DTC brands with Hispanic-market customer concentrations or LatAm expansion plans.",
    illinois:
      "Illinois DTC fulfillment — particularly in the Chicago metro's Aurora / Joliet warehouse belt — is the strongest national-scale DTC market in the US. Brands shipping 5,000+ orders/month from a single facility almost always find Chicago's combination of central-US ground reach, rail intermodal access, and competitive pricing hard to beat.",
    pennsylvania:
      "Pennsylvania DTC fulfillment along the I-95 / I-78 corridor reaches the entire Northeast and Mid-Atlantic in 2-day ground. Philadelphia and Lehigh Valley 3PLs typically offer better pricing than NJ alternatives with comparable Northeast metro reach, making PA a strong choice for DTC brands with Northeast-heavy customer bases.",
    georgia:
      "Georgia DTC fulfillment from Atlanta-area 3PLs covers the Southeast in 2-day ground and reaches Florida, the Carolinas, and Tennessee in 1-day. The market suits brands with Southeast customer concentration and brands serving major Southeast retailers (Home Depot, Lowe's, Publix) where channel-shared inventory makes sense.",
    ohio:
      "Ohio DTC fulfillment — especially in the Columbus and Cincinnati metros — offers among the lowest warehouse real-estate costs east of the Mississippi combined with strong central-US ground reach. Subscription brands and mid-volume DTC operations often find Ohio's unit economics meaningfully better than coastal alternatives.",
    ontario:
      "Ontario DTC fulfillment in the Greater Toronto Area is Canada's primary DTC node, serving 60%+ of national eCommerce volume. Most Toronto-area 3PLs offer dual-channel capability (Canadian DTC + US cross-border via consolidated DDP), which is the defining operational unlock for Canadian brands.",
    "british-columbia":
      "British Columbia DTC fulfillment in the Vancouver metro serves Western Canada plus Asian-route eCommerce inbound from Pacific imports. BC operators commonly run dual-zone setups with US-bonded warehouses across the border in Blaine, Washington, enabling consolidated US cross-border flows.",
    alberta:
      "Alberta DTC fulfillment from Calgary-area operators serves the Prairie provinces and Western Canada outside the Vancouver metro. The market is smaller and more specialized than Ontario or BC, but viable for Alberta-based brands and ones with Prairie customer concentration.",
    england:
      "English DTC fulfillment is concentrated in the Midlands warehouse belt and the M62 corridor. Operators here handle UK national DTC with same-day cutoffs at 4pm GMT for next-day Royal Mail and Evri delivery. The strongest providers add EU cross-border capability via partnered Rotterdam or Antwerp facilities.",
    scotland:
      "Scotland DTC fulfillment serves Scottish customers same-day from Glasgow and Edinburgh-area operators. The market is smaller than English alternatives but offers brands with Scotland-heavy customer bases the operational benefit of avoiding the trucking leg from English warehouses.",
  },
  "cross-border-fulfillment": {
    california:
      "California's cross-border capacity centers on US ↔ Asia (port operations) and US ↔ Mexico via the San Diego / Tijuana corridor. Bay Area and LA-basin 3PLs offer DDP shipping into Mexico with consolidated entries and bilingual customer service, plus growing US ↔ Canada flows via the Pacific Highway crossing.",
    texas:
      "Texas cross-border capability is anchored by the Rio Grande Valley crossings (Laredo, McAllen, El Paso) for Mexico flows. Texas 3PLs offer some of the most mature US ↔ Mexico DDP infrastructure in the country, with established broker relationships and consolidated daily entries.",
    florida:
      "Florida cross-border fulfillment from Miami-area 3PLs is the US's primary gateway to Latin America and the Caribbean. Operators here handle DDP shipping into Mexico, the Caribbean, and Central / South America via PortMiami container service and MIA airfreight, with bilingual customer service for Latin American customers.",
    "british-columbia":
      "British Columbia cross-border 3PLs run consolidated US flows via bonded warehouses on the Washington side of the Pacific Highway crossing. Canadian brands shipping to US customers via this model save 60–80% on individual customs costs vs running separate US entries, making it the dominant Canadian cross-border pattern.",
    alberta:
      "Alberta cross-border capacity is more limited than BC but viable for brands wanting an alternate northern routing. Calgary-area 3PLs partner with bonded warehouses in Sweet Grass, Montana for consolidated US entries on a smaller scale than Vancouver-Blaine.",
    ontario:
      "Ontario cross-border 3PLs run consolidated US flows via the Buffalo / Niagara crossings, the most heavily-trafficked US-Canada border in the country. Toronto-area operators offer consolidated DDP entries that make Canadian-origin US DTC operationally clean for brands selling on both sides of the border.",
    england:
      "English cross-border fulfillment focuses on UK ↔ EU post-Brexit flows. The strongest operators run dual-warehouse setups with partnered facilities in Rotterdam or Antwerp, offering IOSS-compliant DDP shipping into the EU, OSS handling for B2B EU sales, and consolidated returns processing across the channel.",
    scotland:
      "Scottish cross-border capacity is more limited than English Midlands operators, but Glasgow-area 3PLs partner with English EU-side operations to serve Scottish brands needing post-Brexit EU access. The setup adds an extra inbound leg vs Midlands operators but offers Scottish-domestic same-day shipping.",
  },
  "returns-management": {
    california:
      "California returns operations handle high-volume West Coast DTC returns, with strong infrastructure for clothing, footwear, and consumer electronics — the categories that drive most US return volume. Inland Empire 3PLs offer the lowest per-return costs at scale; Bay Area boutique 3PLs handle editorial and premium brands at higher per-unit pricing with detailed disposition reports.",
    texas:
      "Texas returns operations serve central-US DTC brands with two-day inbound coverage from both coasts and competitive disposition pricing. Dallas-area 3PLs typically offer the strongest combination of national reach and unit economics; Houston operators add Mexico cross-border returns capability for brands selling south of the border.",
    "new-york":
      "New York returns infrastructure handles Northeast US returns with strong fashion and lifestyle category specialization. Northern NJ operators run high-volume returns at competitive per-return rates; NY-side boutiques offer detailed inspection and refurbishment for premium brands.",
    florida:
      "Florida returns processing from Miami-area 3PLs serves Southeast US and adds Latin America / Caribbean returns consolidation — the latter being one of the few US markets with established LatAm reverse logistics infrastructure.",
    illinois:
      "Illinois returns operations from Chicago-area 3PLs offer the strongest national-scale returns capability in the US, with rail-intermodal connections to both coasts and 2-day inbound from 95% of the continental US. The market is the natural primary node for high-volume DTC brands consolidating returns nationally.",
    pennsylvania:
      "Pennsylvania returns infrastructure along the I-78 / I-95 corridor handles East Coast returns at competitive rates vs NJ alternatives. Philadelphia and Lehigh Valley 3PLs offer detailed disposition reporting and strong liquidation channel relationships for non-restockable returns.",
    georgia:
      "Georgia returns processing from Atlanta-area 3PLs serves the Southeast with strong fashion and home-goods category infrastructure. The market suits brands with Southeast customer concentration; consolidation back through Atlanta typically saves 40%+ on inbound return shipping vs running multiple regional return centers.",
    ohio:
      "Ohio returns operations — particularly in the Columbus metro — combine the lowest per-return costs east of the Mississippi with strong central-US 2-day inbound coverage. Subscription brands and mid-volume DTC operations consistently find the best returns unit economics in Ohio, even at the cost of slightly slower return-to-restock turnaround vs coastal alternatives.",
    ontario:
      "Ontario returns processing in Toronto handles Canadian domestic returns plus consolidated US-cross-border returns processing — receiving US customer returns at a Canadian address and processing them domestically. The model saves 70%+ on individual cross-border return-shipping costs.",
    "british-columbia":
      "British Columbia returns operations from Vancouver-area 3PLs handle Canadian Western returns plus Pacific-route US cross-border returns. The strongest operators offer photo-documented disposition reporting and established liquidation channels for non-restockable returns.",
    alberta:
      "Alberta returns operations from Calgary 3PLs serve Western Canadian DTC and Prairie-province returns. The market is smaller than Ontario or BC but offers brands with Prairie customer concentration the operational benefit of avoiding the trucking leg to either coast.",
    england:
      "English returns processing from Midlands 3PLs handles UK domestic returns plus EU cross-border return consolidation post-Brexit. The strongest operators run partnered Rotterdam or Antwerp returns intake, consolidating EU returns for processing back in the UK at scale.",
    scotland:
      "Scottish returns operations are smaller than English alternatives but viable for Scotland-heavy DTC brands wanting domestic-feel returns processing. Glasgow-area 3PLs offer photo-documented disposition reporting at competitive rates for the regional volume.",
  },
  "kitting-and-assembly":  {
    california:
      "California kitting capacity is the largest in North America, with strong infrastructure for both volume kitting (subscription boxes, retail bundles) and editorial / boutique kitting (premium gift sets, hand-finished assemblies). Inland Empire operators serve volume programs; Bay Area boutiques run small-batch assembly with editorial-grade quality control.",
    texas:
      "Texas kitting operations from Dallas and Houston-area 3PLs offer competitive pricing on volume programs plus solid central-US distribution reach. The market is strong for retail-bundle programs and gift-set assembly serving major Southeast and Midwest retailers.",
    "new-york":
      "New York kitting infrastructure includes Brooklyn boutique operations specializing in fashion, beauty, and editorial kits — the highest quality bar in the country for hand-finished assembly. NJ-side operators handle higher-volume kitting at lower per-kit costs.",
    florida:
      "Florida kitting capacity from Miami-area 3PLs serves Southeast US and adds Latin America / Caribbean export kitting (bilingual instructions, Caribbean-market gift sets). The market is smaller than California or NY but has unique LatAm-export specialization.",
    illinois:
      "Illinois kitting operations from Chicago-area 3PLs offer the strongest national-scale kitting capability — high-volume monthly cadence builds, retail-bundle programs, and subscription box assembly all run from the Aurora / Joliet warehouse belt with rail-intermodal distribution to both coasts.",
    pennsylvania:
      "Pennsylvania kitting infrastructure along the I-95 corridor handles East Coast kitting programs at competitive pricing. Philadelphia and Lehigh Valley 3PLs run subscription box assembly and retail bundle programs serving the Northeast and Mid-Atlantic.",
    georgia:
      "Georgia kitting from Atlanta-area 3PLs serves Southeast retail bundle programs and gift-set assembly for major Southeast retailers. The market is mid-tier in size but strong on retail compliance for brands kitting into Walmart, Costco, and Wayfair distribution.",
    ohio:
      "Ohio kitting capacity — particularly in the Columbus metro — runs high-volume subscription box and retail-bundle programs at among the lowest per-kit costs east of the Mississippi. The market is the dominant subscription-box-builder choice for brands optimizing for unit economics.",
    ontario:
      "Ontario kitting operations from Toronto-area 3PLs handle Canadian domestic kitting plus dual-channel gift-set assembly for Amazon.ca and Canadian DTC. Bilingual French / English packaging is standard for brands serving Quebec — a unique capability among North American kitting markets.",
  },
  "subscription-box-fulfillment": {
    "new-york":
      "New York subscription operations split between high-volume NJ-side cadence builds and Brooklyn boutique editorial subscriptions. NJ operators handle 5,000+ box monthly cadences at competitive pricing; Brooklyn boutiques specialize in lower-volume editorial subscriptions with hand-finished packaging and per-cycle theming.",
    illinois:
      "Illinois subscription box fulfillment from Chicago-area 3PLs is one of the strongest national markets, with mature monthly-cadence build infrastructure, rail-intermodal distribution to both coasts, and 2-day ground reach into 95% of US households. The market suits subscriptions in the 2,000–25,000 boxes/month range.",
    pennsylvania:
      "Pennsylvania subscription fulfillment from Philadelphia and Lehigh Valley 3PLs serves East Coast subscription programs with same-day cutoff cadence and strong 1-day ground into Northeast metros. The market is mid-tier but high-quality for subscriptions targeting the Northeast.",
    ohio:
      "Ohio subscription box fulfillment is the dominant national subscription market by operator depth. Columbus-area 3PLs run dedicated monthly cadence operations with the lowest per-box assembly costs east of the Mississippi. Most established subscription brands evaluate Ohio at some point in their growth.",
  },
  "cold-storage": {
    california:
      "California cold storage is the largest US cold-chain market, anchored by produce-export infrastructure in the Central Valley and consumer-goods cold operations in the Inland Empire and LA basin. The market handles refrigerated produce, frozen proteins, dairy, and beverage at among the highest volumes in North America.",
    texas:
      "Texas cold storage from Dallas and Houston-area 3PLs serves food and beverage brands shipping nationally. Houston has additional Gulf Coast import handling for refrigerated cargo from Latin America. Both metros offer competitive cold-chain freight rates due to high carrier density.",
    "new-york":
      "New York cold storage capacity in northern New Jersey serves Northeast US refrigerated DTC and B2B retail flows. The market is smaller than California or Texas but high-quality, with strong cold-chain freight relationships for both parcel and LTL refrigerated shipments.",
    florida:
      "Florida cold storage from Miami and Jacksonville-area 3PLs handles Caribbean produce imports, Southeast US refrigerated DTC, and Latin American cold-chain cross-border. Miami has unique cold-chain airfreight capacity via MIA — relevant for high-value perishable shipments.",
    illinois:
      "Illinois cold storage from Chicago-area operators serves national refrigerated DTC and B2B retail. The market combines mature cold-chain infrastructure with rail-intermodal connections, making it a natural primary node for cold-chain brands serving both coasts.",
    pennsylvania:
      "Pennsylvania cold storage along the I-78 / I-81 corridor handles Mid-Atlantic refrigerated DTC and pharma cold-chain. The Lehigh Valley belt has notable cold-chain pharmaceutical infrastructure — relevant for brands in nutraceuticals or pharmacy-adjacent categories.",
    georgia:
      "Georgia cold storage from Atlanta and Savannah-area 3PLs handles Southeast US refrigerated DTC and B2B retail flows into major Southeast retailers (Publix, Whole Foods, Trader Joe's). Savannah port has growing cold-chain import capacity.",
    ohio:
      "Ohio cold storage operations — particularly in the Columbus / Cincinnati / Reno triangle — combine some of the lowest cold-chain real-estate costs east of the Mississippi with strong central-US 2-day refrigerated ground reach. Subscription cold-chain operations and mid-volume frozen DTC find strong unit economics here.",
  },
  "b2b-freight": {
    california:
      "California B2B freight from Inland Empire 3PLs serves major California retailers (Costco, Walmart California, Target California) and West Coast distribution. The market handles the highest US import volume, which feeds directly into B2B retail flows via Long Beach drayage.",
    texas:
      "Texas B2B freight from Dallas-area 3PLs offers central-US distribution with strong rail-intermodal access. The market handles major retailer compliance (Walmart, Target, Costco) at among the lowest per-pallet costs in the US, with broad 2-day LTL coverage into both coasts.",
    "new-york":
      "New York B2B freight from northern NJ operators serves Northeast retail distribution networks and adds NY/NJ port-handling for importer flows. The market handles fashion, beauty, and consumer-goods retail compliance for major Northeast retailers.",
    florida:
      "Florida B2B freight from Miami and Jacksonville 3PLs serves Southeast US retail and adds Caribbean / Latin American export freight. The market is mid-tier in volume but unique on the LatAm-export side — relevant for brands expanding into Caribbean or Central American retail channels.",
    illinois:
      "Illinois B2B freight from Chicago-area 3PLs handles national retail distribution, with rail-intermodal connections feeding Walmart, Target, Costco, and Amazon Vendor Central distribution networks across the continental US. The market is the strongest single national B2B node.",
    pennsylvania:
      "Pennsylvania B2B freight along the I-95 / I-78 / I-81 corridor handles Northeast retail distribution at competitive per-pallet rates vs NJ alternatives. The Lehigh Valley belt has particular strength in retail compliance for major Northeast retailers.",
    georgia:
      "Georgia B2B freight from Atlanta-area 3PLs serves Southeast retail (Home Depot, Lowe's, Wayfair, Publix, Costco Southeast) with strong intermodal rail access from Savannah and the Atlanta airport / rail hub. The market is the Southeast's primary B2B distribution node.",
    ohio:
      "Ohio B2B freight from Columbus and Cincinnati-area 3PLs offers central-US distribution with strong LTL freight pricing and competitive retail compliance. The market suits mid-volume B2B brands shipping into Midwest and Northeast retailer distribution networks.",
  },
};

/** Returns the unique combo blurb for a (category, state), if one exists. */
export function getCategoryStateContext(
  categorySlug: string,
  stateSlug: string
): string | undefined {
  return categoryStateContexts[categorySlug]?.[stateSlug];
}

// ---------------------------------------------------------------------------
// State-specific FAQ generators (used on combo pages)
// ---------------------------------------------------------------------------

export function getStateSpecificFaqs(
  categoryName: string,
  stateName: string
): Faq[] {
  return [
    {
      question: `How do I choose a ${categoryName} partner in ${stateName}?`,
      answer: `Start by clarifying your three operational priorities: pricing model, service-level guarantees, and integration depth. Get rate cards from at least three ${stateName} ${categoryName} partners, ask for the response-time SLA in writing, and confirm their ${stateName}-specific operational track record (years in business, comparable customer references, peak-season performance). Verified partners on Prep Parcel have all passed our vetting process — every shortlist below is a reasonable starting point.`,
    },
    {
      question: `What is the typical response time for ${stateName} 3PL partners?`,
      answer: `Most established ${stateName} 3PLs respond to operational requests within 2–4 hours during business hours, with the best running under 1-hour SLAs. Look for partners who publish a clear escalation path and offer a named account manager rather than a shared inbox — that distinction matters more than the headline response-time number.`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Category slug ↔ display-name mapping
// ---------------------------------------------------------------------------

// Maps category slug (URL fragment) to the display name used in
// partner.services and the sidebar's serviceFilters. Needed because
// CATEGORIES.name uses long form ("FBA Prep Services") while the filter
// sidebar uses short form ("FBA Prep").
export const CATEGORY_SLUG_TO_DISPLAY_NAME: Record<string, string> = {
  "fba-prep-services": "FBA Prep",
  "dtc-fulfillment": "DTC Fulfillment",
  "cold-storage": "Cold Storage",
  "b2b-freight": "B2B Freight",
  "returns-management": "Returns",
  "kitting-and-assembly": "Kitting",
  "subscription-box-fulfillment": "Subscription Boxes",
  "cross-border-fulfillment": "Cross-Border",
};

export const CATEGORY_DISPLAY_NAME_TO_SLUG: Record<string, string> =
  Object.fromEntries(
    Object.entries(CATEGORY_SLUG_TO_DISPLAY_NAME).map(([k, v]) => [v, k])
  );
