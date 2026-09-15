// app/services/task.service.ts
import { prisma } from "@/app/lib/prisma";
import { CreateTaskInput } from "@/app/validations/task.schema";
import { Role, TaskStatus } from "@prisma/client";

export class TaskService {
  static async create(data: CreateTaskInput, createdById: string) {
    return prisma.task.create({
      data: {
        type: data.type,
        referenceId: data.referenceId,
        assignedRole: data.assignedRole,
        notes: data.notes,
        createdById,
      },
    });
  }

  static async findForRole(role: Role, status?: TaskStatus) {
    return prisma.task.findMany({
      where: {
        assignedRole: role,
        ...(status ? { status } : {}),
      },
      include: {
        createdBy: { select: { fullName: true } },
        completedBy: { select: { fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async countPendingForRole(role: Role) {
    return prisma.task.count({
      where: { assignedRole: role, status: "PENDING" },
    });
  }

  // Returns a map of referenceId -> task, for the given type + role +
  // status. Used to annotate a resource list (e.g. Prescriptions) with
  // "pending handoff" badges without a per-row query.
  static async findByReferenceIds(
    type: "PRESCRIPTION" | "APPOINTMENT",
    referenceIds: string[],
  ) {
    const tasks = await prisma.task.findMany({
      where: { type, referenceId: { in: referenceIds } },
      orderBy: { createdAt: "desc" },
    });

    const map = new Map<string, (typeof tasks)[number]>();
    for (const task of tasks) {
      // Keep only the most recent task per reference (already sorted desc)
      if (!map.has(task.referenceId)) {
        map.set(task.referenceId, task);
      }
    }
    return map;
  }

  static async markDone(id: string, completedById: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new Error("TASK_NOT_FOUND");
    }

    return prisma.task.update({
      where: { id },
      data: {
        status: "DONE",
        completedById,
        completedAt: new Date(),
      },
    });
  }
}
