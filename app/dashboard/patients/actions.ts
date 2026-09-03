

"use server";

import { PatientService } from "@/app/services/patient.service";
import { getActionError } from "@/app/lib/actionError";

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
