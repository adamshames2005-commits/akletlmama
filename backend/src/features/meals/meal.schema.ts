import {z} from "zod";

const pricesSchema = z
.object({
    individual: z.number().min(0).optional(),
    smallPot: z.number().min(0).optional(),
    largePot: z.number().min(0).optional(),
})
.refine(
    (prices) => 
       prices.individual !== undefined || prices.smallPot !== undefined || prices.largePot !== undefined,
    {
        message: "At least one price must be provided",
    }
);

export const createMealSchema = z.object({
    name : z.string().min(2).trim(),
    description : z.string().min(2).trim(),
    imageUrl : z.url().optional(),
    prices : pricesSchema,
    isDaily : z.boolean().optional(),
    isActive : z.boolean().optional(),
});

export const updateMealSchema = createMealSchema.partial();

export type CreateMealInput = z.infer<typeof createMealSchema>;
export type UpdateMealInput = z.infer<typeof updateMealSchema>;
//to create a meal type to use it in services and so on

