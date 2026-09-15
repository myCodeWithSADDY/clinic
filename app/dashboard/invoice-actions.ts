"use server";

import { revalidatePath } from "next/cache";
import { PrescriptionService } from "@/app/services/prescription.service";
import { AppointmentService } from "@/app/services/appointment.service";

export async function updatePrescriptionFeeAction(id: string, fee: number) {
  if (Number.isNaN(fee) || fee < 0) {
    return { error: "Enter a valid amount" };
  }

  try {
    await PrescriptionService.update(id, { fee });
  } catch (error) {
    console.error(error);
    return { error: "Failed to save fee" };
  }

  revalidatePath(`/dashboard/prescriptions/${id}/invoice`);
  return { success: true };
}

export async function updateAppointmentFeeAction(id: string, fee: number) {
  if (Number.isNaN(fee) || fee < 0) {
    return { error: "Enter a valid amount" };
  }

  try {
    await AppointmentService.update(id, { fee });
  } catch (error) {
    console.error(error);
    return { error: "Failed to save fee" };
  }

  revalidatePath(`/dashboard/appointment/${id}/invoice`);
  return { success: true };
}
