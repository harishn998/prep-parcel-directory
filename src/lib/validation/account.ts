import { z } from "zod";

export const accountProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .max(80, "Display name must be 80 characters or fewer."),
});

export type AccountProfileUpdate = z.infer<typeof accountProfileSchema>;
