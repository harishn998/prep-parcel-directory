import type { MetadataRoute } from "next";
import {
  CATEGORIES,
  COUNTRIES,
} from "@/lib/taxonomy";
import {
  partners,
  getPartnersByCity,
  getPartnersByState,
  getPartnersByCategoryAndState,
} from "@/lib/sample-data";

const BASE = "https://prepparcelpartners.example";
const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
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
  for (const p of partners) {
    entries.push({
      url: `${BASE}/directory/${p.slug}`,
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

  // Country pages
  for (const country of COUNTRIES) {
    entries.push({
      url: `${BASE}/location/${country.slug}`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.7,
    });

    // State pages
    for (const state of country.states) {
      if (getPartnersByState(state.slug).length === 0) continue;
      entries.push({
        url: `${BASE}/location/${country.slug}/${state.slug}`,
        lastModified: NOW,
        changeFrequency: "monthly",
        priority: 0.7,
      });

      // City pages
      for (const city of state.cities) {
        if (getPartnersByCity(city.slug).length === 0) continue;
        entries.push({
          url: `${BASE}/location/${country.slug}/${state.slug}/${city.slug}`,
          lastModified: NOW,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  // Combo pages (category × state) — highest SEO value
  for (const cat of CATEGORIES) {
    for (const country of COUNTRIES) {
      for (const state of country.states) {
        if (
          getPartnersByCategoryAndState(cat.slug, state.slug).length === 0
        ) {
          continue;
        }
        entries.push({
          url: `${BASE}/category/${cat.slug}/${country.slug}/${state.slug}`,
          lastModified: NOW,
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }

  return entries;
}
