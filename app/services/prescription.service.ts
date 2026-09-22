// app/services/prescription.service.ts
import { prisma } from "@/app/lib/prisma";
import { CreatePrescriptionInput, UpdatePrescriptionInput } from "@/app/validations/prescription.schema";
import { getOrSetCache, invalidateCache } from "../lib/cache";

export class PrescriptionService {
  static async create(data: CreatePrescriptionInput, userId: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId },
    });
    if (!patient) {
      throw new Error("PATIENT_NOT_FOUND");
    }

  const created = await prisma.prescription.create({
    data: {
      patientId: data.patientId,
      userId,
      diagnosis: data.diagnosis,
      disease: data.disease,
      symptoms: data.symptoms,
      since: data.since,
      bp: data.bp,
      pulse: data.pulse,
      tempF: data.tempF,
      weight: data.weight,
      sugar: data.sugar,
      spo2: data.spo2,
      rr: data.rr,
      PreviousReport: data.previousReport,
      allergy: data.allergy,
      ChronicDisease: data.chronicDiseases,
      fee: data.fee,
      clinicalNotes: data.clinicalNotes,
      medications: {
        create: data.medications.map((m) => ({
          medicine: m.medicine,
          medicineType: m.medicineType,
          frequency: m.frequency,
          insideMedicine: m.insideMedicine,
        })),
      },
    },
    include: { medications: true, patient: true },
  });
    await invalidateCache("dashboard:summary");
    await invalidateCache("dashboard:revenue:*");
    await invalidateCache(`patient:${data.patientId}:history`);
    return created;
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
              diagnosis: {
                contains: params.search,
                mode: "insensitive" as const,
              },
            },
            {
              disease: {
                contains: params.search,
                mode: "insensitive" as const,
              },
            },
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

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          medications: true,
          patient: { select: { id: true, fullName: true, phone: true } },
        },
      }),
      prisma.prescription.count({ where }),
    ]);

    return {
      data: prescriptions,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static async findOne(id: string) {
    return getOrSetCache(`prescription:${id}`, 300, async () => {
      const prescription = await prisma.prescription.findUnique({
        where: { id },
        include: {
          medications: true,
          patient: {
            select: {
              id: true,
              fullName: true,
              phone: true,
            },
          },
        },
      });

      if (!prescription) {
        throw new Error("PRESCRIPTION_NOT_FOUND");
      }

      return prescription;
    });
  }

  static async update(id: string, data: UpdatePrescriptionInput) {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      throw new Error("PRESCRIPTION_NOT_FOUND");
    }

    const { medications, ...prescriptionData } = data;

  const updated =  await prisma.prescription.update({
      where: { id },
      data: {
        ...prescriptionData,

        ...(medications !== undefined && {
          medications: {
            deleteMany: {},
            create: medications.map((medication) => ({
              medicine: medication.medicine,
              medicineType: medication.medicineType,
              frequency: medication.frequency,
              insideMedicine: medication.insideMedicine,
            })),
          },
        }),
      },
      include: {
        patient: true,
        medications: true,
      },
    });
    await invalidateCache(`prescription:${id}`);
    await invalidateCache("dashboard:revenue:*");
    await invalidateCache(`patient:${prescription.patientId}:history`);
    return updated;
  }
  static async remove(id: string) {
    const prescription = await prisma.prescription.findUnique({
      where: {
        id,
      },
    });
    if (!prescription) {
      throw new Error("PRESCRIPTION_NOT_FOUND");
    }
   const deleted = await prisma.prescription.delete({
      where: {
        id,
      },
    });
    await invalidateCache(`prescription:${id}`);
    await invalidateCache("dashboard:revenue:*");
    await invalidateCache("dashboard:summary");
    await invalidateCache(`patient:${prescription.patientId}:history`);
    return deleted;
  }
}
