// app/services/appointment.service.ts
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "@/app/validations/appointment.schema";
import { getOrSetCache, invalidateCache } from "../lib/cache";

export class AppointmentService {
  static async create(data: CreateAppointmentInput) {
    let appointment;
    try {
      appointment = await prisma.$transaction(
        async (tx) => {
          if (data.patientId) {
            const patient = await tx.patient.findUnique({
              where: { id: data.patientId },
            });
            if (!patient) {
              throw new Error("PATIENT_NOT_FOUND");
            }
          }

          const conflict = await tx.appointment.findFirst({
            where: {
              startTime: data.startTime,
              status: { notIn: ["CANCELLED", "NO_SHOW"] },
            },
          });
          if (conflict) {
            throw new Error("TIME_SLOT_TAKEN");
          }

          return tx.appointment.create({
            data: {
              patientId: data.patientId ?? undefined,
              walkInPhone: data.walkInPhone ?? undefined,
              walkInName: data.walkInName ?? undefined,
              walkInGender: data.walkInGender ?? undefined,
              walkInAge: data.walkInAge ?? undefined,
              service: data.service,
              date: data.date,
              startTime: data.startTime,
              appointmentType: data.appointmentType,
              complaints: data.complaints ?? undefined,
              notes: data.notes ?? undefined,
              recurring: data.recurring ?? undefined,
              fee: data.fee ?? undefined,
              status: data.status,
            },
            include: {
              patient: { select: { id: true, fullName: true, phone: true } },
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034"
      ) {
        throw new Error("TIME_SLOT_TAKEN");
      }
      throw error;
    }

    await invalidateCache("dashboard:summary");
    await invalidateCache("dashboard:revenue:*");
    await invalidateCache("dashboard:visitors:*");
    return appointment;
  }

  static async findByRange(from: Date, to: Date) {
    const cacheKey = `appointments:range:${from.getTime()}:${to.getTime()}`;

    return getOrSetCache(cacheKey, 60, async () => {
      return prisma.appointment.findMany({
        where: {
          startTime: {
            gte: from,
            lte: to,
          },
        },
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        orderBy: {
          startTime: "asc",
        },
      });
    });
  }

  static async findOne(id: string) {
    return getOrSetCache(`appointment:${id}`, 300, async () => {
      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: { patient: true },
      });

      if (!appointment) {
        throw new Error("APPOINTMENT_NOT_FOUND");
      }

      return appointment;
    });
  }

  static async update(id: string, data: UpdateAppointmentInput) {
    await this.findOne(id);

    const updated = await prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
    });

    await invalidateCache(`appointment:${id}`);
    await invalidateCache("appointments:range:*");

    await invalidateCache("dashboard:summary");
    await invalidateCache("dashboard:revenue:*");
    await invalidateCache("dashboard:visitors:*");

    return updated;
  }

  static async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = params.search
      ? {
          OR: [
            {
              walkInName: {
                contains: params.search,
                mode: "insensitive" as const,
              },
            },
            { walkInPhone: { contains: params.search } },
            {
              patient: {
                fullName: {
                  contains: params.search,
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {};

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: "desc" },
        include: {
          patient: { select: { id: true, fullName: true, phone: true } },
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
