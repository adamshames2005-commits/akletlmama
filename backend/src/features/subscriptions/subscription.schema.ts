import { z } from "zod";

export const subscriptionSizeSchema = z.enum(["individual", "smallPot", "largePot"]);

export const createSubscriptionSchema = z.object({
  selections: z.array(z.object({
    date: z.string().trim().min(1),
    mealId: z.string().min(1),
    size: subscriptionSizeSchema,
  })).length(20),
});

export const updateSubscriptionDiscountSchema = z.object({
  discountPercentage: z.number().min(0).max(100),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;