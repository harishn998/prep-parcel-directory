import { z } from "zod";

export const userRoleUpdateSchema = z.object({
  userId: z.string().uuid(),
  newRole: z.enum(["user", "admin"]),
});

export type UserRoleUpdate = z.infer<typeof userRoleUpdateSchema>;
