import { z } from "zod";

export const createOrderSchema = z.object({
  items: z.array(z.object({
    mealId: z.string().min(1),
    mealName: z.string().min(1),
    size: z.enum(["individual", "smallPot", "largePot"]),
    price: z.number().nonnegative(),
  })).min(1),
  deliveryLocation: z.string().trim().min(3),
  alternatePhone: z.string().trim().optional(),
});
