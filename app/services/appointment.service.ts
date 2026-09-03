// app/services/appointment.service.ts
import { prisma } from "@/app/lib/prisma";
import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "@/app/validations/appointment.schema";

export class AppointmentService {
  static async create(data: CreateAppointmentInput) {

    if (data.patientId) {
      const patient = await prisma.patient.findUnique({
        where: { id: data.patientId },
      });
      if (!patient) {
        throw new Error("PATIENT_NOT_FOUND");
      }
    }

    return prisma.appointment.create({
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
        status: data.status,
      },
      include: {
        patient: { select: { id: true, fullName: true, phone: true } },
      },
    });
  }


  static async findByRange(from: Date, to: Date) {
    return prisma.appointment.findMany({
      where: { startTime: { gte: from, lte: to } },
      include: { patient: { select: { id: true, fullName: true } } },
      orderBy: { startTime: "asc" },
    });
  }

  static async findOne(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { patient: true },
    });
    if (!appointment) {
      throw new Error("APPOINTMENT_NOT_FOUND");
    }
    return appointment;
  }

  static async update(id: string, data: UpdateAppointmentInput) {
    await this.findOne(id); // throws APPOINTMENT_NOT_FOUND if missing

    return prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: { select: { id: true, fullName: true, phone: true } },
      },
    });
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
