// app/dashboard/appointments/actions.ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AppointmentService } from "@/app/services/appointment.service";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "@/app/validations/appointment.schema";
import { invalidateCache } from "@/app/lib/cache";

export type AppointmentState = { error?: string } | null;

export async function createAppointmentAction(
  prevState: AppointmentState,
  formData: FormData,
): Promise<AppointmentState> {
  const raw = {
    patientId: formData.get("patientId") || undefined,
    walkInPhone: formData.get("walkInPhone") || undefined,
    walkInName: formData.get("walkInName") || undefined,
    walkInGender: formData.get("walkInGender") || undefined,
    walkInAge: formData.get("walkInAge") || undefined,
    service: formData.get("service"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    appointmentType: formData.get("appointmentType"),
    complaints: formData.get("complaints") || undefined,
    notes: formData.get("notes") || undefined,
    recurring: formData.get("recurring") || undefined,
    fee: formData.get("fee") || undefined,
    status: "CONFIRMED" as const,
  };

  const validation = createAppointmentSchema.safeParse(raw);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid input" };
  }

  try {
    await AppointmentService.create(validation.data);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "PATIENT_NOT_FOUND") {
      return { error: "Selected patient no longer exists." };
    }
    if (error instanceof Error && error.message === "TIME_SLOT_TAKEN") {
      return { error: "This time slot is already booked." };
    }
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
await invalidateCache("dashboard:*");
  redirect("/dashboard/appointment");
}

export async function updateAppointmentStatusAction(
  id: string,
  status: string,
) {
  const validation = updateAppointmentSchema.safeParse({ status });
  if (!validation.success) {
    return { error: "Invalid status" };
  }

  try {
    await AppointmentService.update(id, validation.data);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "APPOINTMENT_NOT_FOUND") {
      return { error: "Appointment not found" };
    }
    console.error(error);
    return { error: "Something went wrong" };
  }

  revalidatePath(`/dashboard/appointment/${id}`);
  return { success: true };
}
