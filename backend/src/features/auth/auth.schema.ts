import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\s+/g, ""))
  .refine(
    (value) => /^\+?\d{8,15}$/.test(value),
    "Enter a valid phone number with 8 to 15 digits"
  );

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters"),
  phone: phoneSchema,
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Password is required"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const normalizePhone = (phone: string) => phone.replace(/[\s()-]/g, "");
