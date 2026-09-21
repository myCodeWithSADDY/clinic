"use server";

import { PrescriptionService } from "@/app/services/prescription.service";
import { createPrescriptionSchema } from "@/app/validations/prescription.schema";
import { requireAuth } from "@/app/lib/require-auth";
import { getActionError } from "@/app/lib/actionError";
import { invalidateCache } from "@/app/lib/cache";

export type PrescriptionState = { error?: string; success?: string } | null;

export async function createPrescriptionAction(
  prevState: PrescriptionState,
  formData: FormData,
): Promise<PrescriptionState> {
  let userId: string;
  try {
    const payload = await requireAuth();

    userId = payload.userId as string;
  } catch {
    return { error: "You must be logged in." };
  }

  let medications: unknown;
  try {
    medications = JSON.parse(formData.get("medications") as string);
  } catch {
    return { error: "Invalid medication data." };
  }
  const chronicDiseasesRaw = formData.get("chronicDiseases");

  let chronicDiseases: unknown = [];

  try {
    chronicDiseases = JSON.parse(String(chronicDiseasesRaw ?? "[]"));
  } catch {
    chronicDiseases = null;
  }

  const raw = {
    patientId: formData.get("patientId"),
    diagnosis: formData.get("diagnosis"),
    disease: formData.get("disease"),
    symptoms: formData.get("symptoms"),
    since: formData.get("since"),
    allergy: formData.get("allergy")?.toString() ?? "",
    PreviousReport: formData.get("previousReport,")?.toString() ?? "",
    chronicDiseases,
    bp: formData.get("bp") || undefined,
    pulse: formData.get("pulse") || undefined,
    tempF: formData.get("tempF") || undefined,
    weight: formData.get("weight") || undefined,
    sugar: formData.get("sugar") || undefined,
    spo2: formData.get("spo2") || undefined,
    rr: formData.get("rr") || undefined,
    clinicalNotes: formData.get("clinicalNotes"),
    medications,
    fee: formData.get("fee") || undefined,
  };
  const validation = createPrescriptionSchema.safeParse(raw);
  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Invalid input" };
  }

  try {
    await PrescriptionService.create(validation.data, userId);
  } catch (error: unknown) {
    return { error: getActionError(error, "unable to create Prescription") };
  }

  await invalidateCache("dashboard:*");

  return { success: "Prescription created successfully" };
}

export async function removePrescriptionAction(id: string) {
  try {
    const payload = await requireAuth();
    if (payload.role !== "DOCTOR") {
      return { error: "Only doctors can delete prescriptions." };
    }

    await PrescriptionService.remove(id);
  } catch (error) {
    return {
      error: getActionError(error, "Unable to delete prescription"),
    };
  }

  await invalidateCache("dashboard:*");

  return {
    success: "Prescription deleted successfully",
  };
}
