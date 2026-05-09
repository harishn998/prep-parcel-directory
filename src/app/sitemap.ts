import type { MetadataRoute } from "next";
import { CATEGORIES, COUNTRIES } from "@/lib/taxonomy";
import {
  getAllPartnerSlugs,
  getPartnersByCity,
  getPartnersByState,
  getPartnersByCategoryAndState,
} from "@/lib/data/partners";

const BASE = "https://prepparcelpartners.example";
const NOW = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Home
  entries.push({
    url: `${BASE}/`,
    lastModified: NOW,
    changeFrequency: "weekly",
    priority: 1.0,
  });

  // Directory
  entries.push({
    url: `${BASE}/directory`,
    lastModified: NOW,
    changeFrequency: "weekly",
    priority: 0.9,
  });

  // Category and Location index pages
  entries.push({
    url: `${BASE}/category`,
    lastModified: NOW,
    changeFrequency: "weekly",
    priority: 0.7,
  });
  entries.push({
    url: `${BASE}/location`,
    lastModified: NOW,
    changeFrequency: "weekly",
    priority: 0.7,
  });

  // Partner profiles
  const slugs = await getAllPartnerSlugs();
  for (const slug of slugs) {
    entries.push({
      url: `${BASE}/directory/${slug}`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Category landing pages
  for (const cat of CATEGORIES) {
    entries.push({
      url: `${BASE}/category/${cat.slug}`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Country pages — collect (country, state, city) candidates and check counts in parallel
  type StateEntry = { country: string; state: string };
  type CityEntry = StateEntry & { city: string };
  type ComboEntry = { cat: string; country: string; state: string };

  const stateCandidates: StateEntry[] = [];
  const cityCandidates: CityEntry[] = [];
  const comboCandidates: ComboEntry[] = [];

  for (const country of COUNTRIES) {
    entries.push({
      url: `${BASE}/location/${country.slug}`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.7,
    });

    for (const state of country.states) {
      stateCandidates.push({ country: country.slug, state: state.slug });
      for (const city of state.cities) {
        cityCandidates.push({
          country: country.slug,
          state: state.slug,
          city: city.slug,
        });
      }
    }
  }

  for (const cat of CATEGORIES) {
    for (const country of COUNTRIES) {
      for (const state of country.states) {
        comboCandidates.push({
          cat: cat.slug,
          country: country.slug,
          state: state.slug,
        });
      }
    }
  }

  const [statesWithCounts, citiesWithCounts, combosWithCounts] =
    await Promise.all([
      Promise.all(
        stateCandidates.map(async (s) => ({
          ...s,
          count: (await getPartnersByState(s.state)).length,
        }))
      ),
      Promise.all(
        cityCandidates.map(async (c) => ({
          ...c,
          count: (await getPartnersByCity(c.city)).length,
        }))
      ),
      Promise.all(
        comboCandidates.map(async (c) => ({
          ...c,
          count: (await getPartnersByCategoryAndState(c.cat, c.state)).length,
        }))
      ),
    ]);

  for (const s of statesWithCounts) {
    if (s.count === 0) continue;
    entries.push({
      url: `${BASE}/location/${s.country}/${s.state}`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }
  for (const c of citiesWithCounts) {
    if (c.count === 0) continue;
    entries.push({
      url: `${BASE}/location/${c.country}/${c.state}/${c.city}`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  for (const c of combosWithCounts) {
    if (c.count === 0) continue;
    entries.push({
      url: `${BASE}/category/${c.cat}/${c.country}/${c.state}`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
