// app/validations/prescription.schema.ts
import { z } from "zod";

export const medicineTypeEnum = z.enum([
  "CAPSULE",
  "INJECTION",
  "DROP",
  "DROPS",
  "DROPPER",
  "GLOBUS",
  "DRAM",
  "TABLET",
  "SOLUTION",
  "GEL",
  "SYRUP",
  "SUSPENSION",
  "CREAM",
  "LIQUID",
  "LOTION",
  "SACHET",
  "OINTMENT",
  "POWDER",
  "INHALER",
  "SPRAY",
  "SUPPOSITORY",
  "EMULSION",
  "BALM",
  "SOAP",
  "SHAMPOO",
  "FACEWASH",
  "TEASPOON",
  "AS_PER_NEED",
  "HALF_HOUR_BEFORE_MEAL",
  "FIVE_TIMES_A_DAY",
  "PO",
  "IV",
  "IM",
  "IG",
  "SC",
  "SL",
  "PR",
]);

export const medicationSchema = z.object({
  medicine: z.string().min(1, "Medicine name is required"),
  medicineType: medicineTypeEnum,
  frequency: z.string().min(1, "Frequency is required"),
  insideMedicine: z.string().optional(),
});

export const createPrescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  disease: z.string().min(1, "Disease is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  since: z.coerce.date(),

  // Vitals -- all optional
  bp: z.string().optional(),
  pulse: z.string().optional(),
  tempF: z.string().optional(),
  weight: z.string().optional(),
  sugar: z.string().optional(),
  spo2: z.string().optional(),
  rr: z.string().optional(),

  clinicalNotes: z.string().min(1, "Clinical notes are required"),

  medications: z.array(medicationSchema).min(1, "Add at least one medicine"),
});
export const updatePrescriptionSchema = createPrescriptionSchema.partial();
export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>;
export type MedicationInput = z.infer<typeof medicationSchema>;
export type UpdatePrescriptionInput = z.infer<typeof updatePrescriptionSchema>;
