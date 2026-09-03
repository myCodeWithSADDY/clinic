// validations/patient.schema.ts

import { z } from "zod";

export const genderEnum = z.enum(["MALE", "FEMALE"]);

export const createPatientSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 characters")
    .max(20, "Phone number is too long"),

  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),

  gender: genderEnum.optional(),

  weightKg: z
    .number()
    .int("Weight must be a whole number")
    .positive("Weight must be greater than 0")
    .max(500, "Weight is invalid")
    .optional(),

  dateOfBirth: z.coerce
    .date()
    .refine(
      (date) => date <= new Date(),
      "Date of birth cannot be in the future",
    ),

  cnic: z
    .string()
    .trim()
    .transform((value) => value.replace(/-/g, ""))
    .refine(
      (value) => value === "" || /^\d{13}$/.test(value),
      "CNIC must contain 13 digits",
    )
    .optional(),

  houseNo: z.string().trim().max(100, "House number is too long").optional(),

  area: z.string().trim().max(100, "Area is too long").optional(),

  city: z.string().trim().max(100, "City is too long").optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientInput = z.infer<typeof createPatientSchema>;

export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
