// app/validations/task.schema.ts
import { z } from "zod";

export const taskTypeEnum = z.enum(["PRESCRIPTION", "APPOINTMENT"]);
export const roleEnum = z.enum(["DOCTOR", "RECEPTIONIST"]);

export const createTaskSchema = z.object({
  type: taskTypeEnum,
  referenceId: z.string().min(1),
  assignedRole: roleEnum,
  notes: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
