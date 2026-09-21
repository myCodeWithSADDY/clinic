import { prisma } from "@/app/lib/prisma";

import {
  CreatePatientInput,
  UpdatePatientInput,
} from "@/app/validations/patient.schema";

import { getOrSetCache, invalidateCache } from "@/app/lib/cache";
import { generateMedicalRecordId } from "../lib/medical-record";

export class PatientService {
  static async create(data: CreatePatientInput) {
    const existing = await prisma.patient.findUnique({
      where: { phone: data.phone },
    });

    if (existing) {
      throw new Error("PHONE_ALREADY_EXISTS");
    }

    const patientCount = await prisma.patient.count();

    const medicalRecordId = generateMedicalRecordId({
      ...data,
      sequence: patientCount + 1,
    });

    const patient = await prisma.patient.create({
      data: {
        ...data,
        medicalRecordId,
      },
    });

    await invalidateCache("dashboard:summary");

    return patient;
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
            {
              phone: {
                contains: params.search,
              },
            },
            {
              cnic: {
                contains: params.search,
              },
            },
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
    return getOrSetCache(`patient:${id}`, 300, async () => {
      const patient = await prisma.patient.findUnique({
        where: { id },
      });

      if (!patient) {
        throw new Error("PATIENT_NOT_FOUND");
      }

      return patient;
    });
  }

  static async findWithHistory(id: string) {
    return getOrSetCache(`patient:${id}:history`, 300, async () => {
      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          prescriptions: {
            orderBy: {
              since: "desc",
            },
            include: {
              medications: true,
              user: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
        },
      });

      if (!patient) {
        throw new Error("PATIENT_NOT_FOUND");
      }

      return patient;
    });
  }

  static async update(id: string, data: UpdatePatientInput) {
    await this.findOne(id);

    if (data.phone) {
      const existing = await prisma.patient.findUnique({
        where: { phone: data.phone },
      });

      if (existing && existing.id !== id) {
        throw new Error("PHONE_ALREADY_EXISTS");
      }
    }

    const updated = await prisma.patient.update({
      where: { id },
      data,
    });

    await invalidateCache(`patient:${id}`);
    await invalidateCache(`patient:${id}:history`);

    return updated;
  }
  static async quickSearch(search: string) {
    const query = search.trim();

    if (!query) {
      return [];
    }

    return prisma.patient.findMany({
      where: {
        OR: [
          {
            fullName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: query,
            },
          },
          {
            cnic: {
              contains: query,
            },
          },
        ],
      },
      select: {
        id: true,
        fullName: true,
        phone: true,
        cnic: true,
      },
      orderBy: {
        fullName: "asc",
      },
      take: 8,
    });
  }
  static async remove(id: string) {
    try {
      await this.findOne(id);

      await prisma.patient.delete({
        where: {
          id,
        },
      });

      await invalidateCache(`patient:${id}`);
      await invalidateCache(`patient:${id}:history`);
      await invalidateCache("dashboard:summary");

      return { success: true };
    } catch (error) {
      console.log(error);

      return {
        error: "Unable to remove patient",
      };
    }
  }
}
