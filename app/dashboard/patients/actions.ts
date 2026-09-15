"use server";

import { PatientService } from "@/app/services/patient.service";
import { getActionError } from "@/app/lib/actionError";
import { createPatientSchema } from "@/app/validations/patient.schema";

export async function removePatientAction(id: string) {
  try {
    await PatientService.remove(id);

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: getActionError(error, "Unable to remove patient"),
    };
  }
}
export type PatientState = { error?: string; success?: string } | null;

export async function createPatientAction(
  prevState: PatientState,
  formData: FormData,
): Promise<PatientState> {
  const raw = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender") || undefined,
    weightKg: formData.get("weightKg")
      ? Number(formData.get("weightKg"))
      : undefined,
    cnic: formData.get("cnic") || undefined,
    houseNo: formData.get("houseNo") || undefined,
    area: formData.get("area") || undefined,
    city: formData.get("city") || undefined,
  };

  const validation = createPatientSchema.safeParse(raw);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid input" };
  }

  try {
    await PatientService.create(validation.data);
  } catch (error: unknown) {
    return { error: getActionError(error, "Unable to create patient") };
  }

  return { success: "Patient created successfully" };
}