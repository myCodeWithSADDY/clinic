import { z } from "zod";

const appointmentFields = {
  patientId: z.string().optional().nullable(),

  walkInPhone: z.string().optional().nullable(),
  walkInName: z.string().optional().nullable(),
  walkInGender: z.enum(["MALE", "FEMALE"]).optional().nullable(),
  walkInAge: z.string().optional().nullable(),

  service: z.enum(["CONSULTATION", "MEDICINE"]),

  date: z.coerce.date(),

  startTime: z.coerce.date(),

  appointmentType: z.enum(["REGULAR_CHECKUP", "TELEMEDICINE"]),

  complaints: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  fee: z.coerce.number().min(0).optional().nullable(),
  recurring: z.coerce.date().optional().nullable(),

  status: z.enum([
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
    "RESCHEDULED",
    "NO_SHOW",
  ]),
};

export const createAppointmentSchema = z.object(appointmentFields).refine(
  (data) => {
    return data.patientId || data.walkInPhone;
  },
  {
    message: "Either a patient or walk-in phone is required",
    path: ["patientId"],
  },
);

export const updateAppointmentSchema = z
  .object(appointmentFields)
  .partial()
  .refine(
    (data) => {
      // Only validate this if either field is being updated.
      if (data.patientId === undefined && data.walkInPhone === undefined) {
        return true;
      }

      return data.patientId || data.walkInPhone;
    },
    {
      message: "Either a patient or walk-in phone is required",
      path: ["patientId"],
    },
  );

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
