// services/patient.service.ts


import { prisma } from "@/app/lib/prisma";
import {
  CreatePatientInput,
  UpdatePatientInput,
} from "@/app/validations/patient.schema";

export class PatientService {
  static async create(data: CreatePatientInput) {
    const existing = await prisma.patient.findUnique({
      where: { phone: data.phone },
    });
    if (existing) {
      throw new Error("PHONE_ALREADY_EXISTS");
    }

    return prisma.patient.create({ data });
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
              fullName: {
                contains: params.search,
                mode: "insensitive" as const,
              },
            },
            { phone: { contains: params.search } },
            { cnic: { contains: params.search } },
          ],
        }
      : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.patient.count({ where }),
    ]);

    return {
      data: patients,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findOne(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
    });
    if (!patient) {
      throw new Error("PATIENT_NOT_FOUND");
    }
    return patient;
  }

  static async update(id: string, data: UpdatePatientInput) {
    await this.findOne(id); // throws PATIENT_NOT_FOUND if missing

    if (data.phone) {
      const existing = await prisma.patient.findUnique({
        where: { phone: data.phone },
      });
      if (existing && existing.id !== id) {
        throw new Error("PHONE_ALREADY_EXISTS");
      }
    }

    return prisma.patient.update({
      where: { id },
      data,
    });
  }

  static async remove(id: string) {
    try {
      await this.findOne(id)
      await prisma.patient.delete({
        where: {
          id
        }
      })
      return {success: true}
    } catch (error) {
      console.log(error);
       return {
         error: "Unable to remove patient",
       };
    }
  }
}
