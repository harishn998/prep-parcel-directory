import { z } from "zod";

export const warehouseFormSchema = z.object({
  city: z.string().min(2).max(80),
  address: z.string().max(200).optional().nullable(),
  sqft: z.number().int().min(0).optional().nullable(),
  hours: z.string().max(120).optional().nullable(),
  services: z.array(z.string()).default([]),
  isPrimary: z.boolean().default(false),
});

export type WarehouseFormData = z.infer<typeof warehouseFormSchema>;

export const warehouseUpdateSchema = warehouseFormSchema.partial();
export type WarehouseUpdateData = z.infer<typeof warehouseUpdateSchema>;
