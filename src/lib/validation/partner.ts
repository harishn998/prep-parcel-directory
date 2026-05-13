import { z } from "zod";

export const partnerFormSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  name: z.string().min(2).max(120),
  tagline: z.string().max(200).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),

  // Location
  location: z.string().min(2).max(120),
  country: z.enum(["USA", "Canada", "UK"]),
  countryCode: z.enum(["US", "CA", "GB"]),
  state: z.string().min(2).max(80),
  stateFullName: z.string().min(2).max(80),
  city: z.string().min(2).max(80).optional().nullable(),
  cityFullName: z.string().min(2).max(80).optional().nullable(),
  servedStates: z.array(z.string()).default([]),

  // Business
  yearFounded: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional()
    .nullable(),
  employeeCount: z.string().max(40).optional().nullable(),
  minimumOrderVolume: z.string().max(40).optional().nullable(),
  pricingModel: z.string().max(120).optional().nullable(),
  responseTime: z.string().max(80).optional().nullable(),
  fulfillmentSpeed: z.string().max(120).optional().nullable(),
  orderAccuracy: z.number().min(0).max(100).optional().nullable(),
  activeBrandsServed: z.number().int().min(0).optional().nullable(),

  // Tags
  services: z.array(z.string()).default([]),
  serviceCategories: z.array(z.string()).default([]),
  integrations: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  specialties: z.array(z.string()).default([]),

  // Contact
  contact: z
    .object({
      phone: z.string().optional().nullable(),
      email: z.string().email().optional().nullable().or(z.literal("")),
      website: z.string().url().optional().nullable().or(z.literal("")),
    })
    .optional()
    .nullable(),

  // Status flags
  verified: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),

  // SEO
  metaTitle: z.string().max(120).optional().nullable(),
  metaDescription: z.string().max(200).optional().nullable(),
});

export type PartnerFormData = z.infer<typeof partnerFormSchema>;

// For updates we accept a partial (admin can edit any subset of fields).
export const partnerUpdateSchema = partnerFormSchema.partial();
export type PartnerUpdateData = z.infer<typeof partnerUpdateSchema>;
