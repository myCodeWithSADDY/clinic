// app/dashboard/tasks/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { TaskService } from "@/app/services/task.service";
import { createTaskSchema } from "@/app/validations/task.schema";
import { requireAuth } from "@/app/lib/require-auth";
import { getActionError } from "@/app/lib/actionError";

// Called by a doctor to send a prescription to reception
export async function sendPrescriptionToReceptionAction(
  prescriptionId: string,
  notes?: string,
) {
  try {
    const payload = await requireAuth();
    // "sub" holds the user id -- see note on requireAuth's return type
    const userId = payload.userId as string;

    const validation = createTaskSchema.safeParse({
      type: "PRESCRIPTION",
      referenceId: prescriptionId,
      assignedRole: "RECEPTIONIST",
      notes,
    });

    if (!validation.success) {
      return { error: "Invalid task data" };
    }

    await TaskService.create(validation.data, userId);
    revalidatePath("/dashboard/prescriptions");
    return { success: "Sent to reception" };
  } catch (error) {
    return { error: getActionError(error, "Unable to send to reception") };
  }
}


export async function markTaskDoneAction(taskId: string) {
  try {
    const payload = await requireAuth();
    const userId = payload.userId as string;

    await TaskService.markDone(taskId, userId);
    revalidatePath("/dashboard/prescriptions");
    return { success: "Marked as done" };
  } catch (error) {
    return { error: getActionError(error, "Unable to update task") };
  }
}
