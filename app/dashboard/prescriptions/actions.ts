"use server";

import { cookies } from "next/headers";
import { PrescriptionService } from "@/app/services/prescription.service";
import { createPrescriptionSchema } from "@/app/validations/prescription.schema";
import { verifyToken } from "@/app/lib/auth";
import { getActionError } from "@/app/lib/actionError";

export type PrescriptionState = { error?: string; success?: string } | null;

export async function createPrescriptionAction(
  prevState: PrescriptionState,
  formData: FormData,
): Promise<PrescriptionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: "You must be logged in." };
  }

  let userId: string;
  try {
    const payload = await verifyToken(token);
    userId = payload.sub as string;
  } catch {
    return { error: "Your session has expired. Please log in again." };
  }

  let medications: unknown;
  try {
    medications = JSON.parse(formData.get("medications") as string);
  } catch {
    return { error: "Invalid medication data." };
  }

  const raw = {
    patientId: formData.get("patientId"),
    diagnosis: formData.get("diagnosis"),
    disease: formData.get("disease"),
    symptoms: formData.get("symptoms"),
    since: formData.get("since"),
    bp: formData.get("bp") || undefined,
    pulse: formData.get("pulse") || undefined,
    tempF: formData.get("tempF") || undefined,
    weight: formData.get("weight") || undefined,
    sugar: formData.get("sugar") || undefined,
    spo2: formData.get("spo2") || undefined,
    rr: formData.get("rr") || undefined,
    clinicalNotes: formData.get("clinicalNotes"),
    medications,
  };
  const validation = createPrescriptionSchema.safeParse(raw);
  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Invalid input" };
  }

  try {
    await PrescriptionService.create(validation.data, userId);
    return { success: "Prescription created successfully" };
  } catch (error: unknown) {
    return { error: getActionError(error, "unable to create Prescription") };
  }
}
export async function removePrescriptionAction(id: string) {
  try {
    await PrescriptionService.remove(id);

    return {
      success: "Prescription deleted successfully",
    };
  } catch (error) {
    return {
      error: getActionError(error, "Unable to delete prescription"),
    };
  }
}