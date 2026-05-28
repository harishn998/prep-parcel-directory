/**
 * Pure filtering and sorting logic for the partner directory.
 * Extracted out of DirectoryView so server-rendered pages (category, location,
 * combo) can pre-narrow the partner list before passing into DirectoryView.
 */
import type { Partner } from "./data/types";
import type { SortValue } from "./static-data";

export type Filters = {
  search: string;
  services: Set<string>;
  locations: Set<string>;
  integrations: Set<string>;
  certifications: Set<string>;
  volume: "any" | "100" | "500" | "1000";
  rating: "any" | "3.5" | "4.0" | "4.5";
  quickFilters: Set<string>;
};

export function emptyFilters(): Filters {
  return {
    search: "",
    services: new Set(),
    locations: new Set(),
    integrations: new Set(),
    certifications: new Set(),
    volume: "any",
    rating: "any",
    quickFilters: new Set(),
  };
}

export function hasAnyFilter(f: Filters): boolean {
  return (
    f.search.trim() !== "" ||
    f.services.size > 0 ||
    f.locations.size > 0 ||
    f.integrations.size > 0 ||
    f.certifications.size > 0 ||
    f.volume !== "any" ||
    f.rating !== "any" ||
    f.quickFilters.size > 0
  );
}

const minRatingMap: Record<string, number> = {
  "4.5": 4.5,
  "4.0": 4.0,
  "3.5": 3.5,
  any: 0,
};

const minVolumeMap: Record<string, number> = {
  "1000": 1000,
  "500": 500,
  "100": 100,
  any: 0,
};

const partnerVolumeMap: Record<string, number> = {
  none: 0,
  "100": 100,
  "500": 500,
  "1000": 1000,
};

// Maps state display name → slug, and reverse, so the location filter can
// match partners whose servedStates carries slugs (e.g. "california") even
// when the filter token is the display name ("California").
export const STATE_NAME_TO_SLUG: Record<string, string> = {
  California: "california",
  Texas: "texas",
  "New York": "new-york",
  Florida: "florida",
  Illinois: "illinois",
  Pennsylvania: "pennsylvania",
  Georgia: "georgia",
  Ohio: "ohio",
  Ontario: "ontario",
  "British Columbia": "british-columbia",
  Alberta: "alberta",
  England: "england",
  Scotland: "scotland",
};

export const STATE_SLUG_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAME_TO_SLUG).map(([k, v]) => [v, k])
);

// Phase 2A: apply only the dimensions that the server-side query does NOT
// handle. The server already filters by q/services/country/state/city, so
// here we narrow further by the dimensions that stay client-side
// (integrations, certifications, volume, rating, quickFilters). search and
// services/locations are skipped on purpose.
export function applyClientOnlyFilters(items: Partner[], f: Filters): Partner[] {
  const minRating = minRatingMap[f.rating];
  const minVolume = minVolumeMap[f.volume];
  return items.filter((p) => {
    if (p.rating < minRating) return false;
    if (minVolume > 0 && partnerVolumeMap[p.minimumOrderVolume] < minVolume) {
      return false;
    }
    if (f.integrations.size > 0) {
      const partnerIntegrations = new Set(p.integrations);
      for (const i of f.integrations) {
        if (!partnerIntegrations.has(i)) return false;
      }
    }
    if (f.certifications.size > 0) {
      const partnerCerts = new Set(p.certifications);
      for (const c of f.certifications) {
        if (!partnerCerts.has(c)) return false;
      }
    }
    if (f.quickFilters.size > 0) {
      const partnerServices = new Set(p.services);
      let hit = false;
      for (const s of f.quickFilters) {
        if (partnerServices.has(s)) {
          hit = true;
          break;
        }
      }
      if (!hit) return false;
    }
    return true;
  });
}

export function applyFilters(items: Partner[], f: Filters): Partner[] {
  const search = f.search.trim().toLowerCase();
  const minRating = minRatingMap[f.rating];
  const minVolume = minVolumeMap[f.volume];
  const serviceFilter = new Set([
    ...Array.from(f.services),
    ...Array.from(f.quickFilters),
  ]);
  return items.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search)) return false;
    if (p.rating < minRating) return false;

    if (serviceFilter.size > 0) {
      const partnerServices = new Set(p.services);
      let hit = false;
      for (const s of serviceFilter) {
        if (partnerServices.has(s)) {
          hit = true;
          break;
        }
      }
      if (!hit) return false;
    }

    if (f.locations.size > 0) {
      const matchesCountry =
        (f.locations.has("United States") && p.countryCode === "US") ||
        (f.locations.has("Canada") && p.countryCode === "CA") ||
        (f.locations.has("United Kingdom") && p.countryCode === "GB");
      const matchesRegion =
        f.locations.has(p.region) ||
        f.locations.has(p.stateFullName) ||
        f.locations.has(p.state) ||
        p.servedStates.some(
          (s) =>
            f.locations.has(s) ||
            f.locations.has(STATE_SLUG_TO_NAME[s] ?? "")
        ) ||
        // Also check if filter has the display name corresponding to a served state
        Array.from(f.locations).some((token) => {
          const slug = STATE_NAME_TO_SLUG[token];
          return slug !== undefined && p.servedStates.includes(slug);
        });
      if (!matchesCountry && !matchesRegion) return false;
    }

    if (f.integrations.size > 0) {
      const partnerIntegrations = new Set(p.integrations);
      for (const i of f.integrations) {
        if (!partnerIntegrations.has(i)) return false;
      }
    }

    if (f.certifications.size > 0) {
      const partnerCerts = new Set(p.certifications);
      for (const c of f.certifications) {
        if (!partnerCerts.has(c)) return false;
      }
    }

    if (minVolume > 0 && partnerVolumeMap[p.minimumOrderVolume] < minVolume) {
      return false;
    }

    return true;
  });
}

export function applySort(items: Partner[], sort: SortValue): Partner[] {
  const list = [...items];
  switch (sort) {
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "reviews":
      list.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "newest":
      list.sort((a, b) => b.yearFounded - a.yearFounded);
      break;
    default:
      break;
  }
  return list;
}
