import { prisma } from "@/app/lib/prisma";

export class DashboardService {
  static async getStats() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [totalPatients, todaysAppointments, prescriptionsIssued] =
      await Promise.all([
        prisma.patient.count(),

        prisma.appointment.count({
          where: {
            date: {
              gte: startOfToday,
              lte: endOfToday,
            },
          },
        }),

        prisma.prescription.count({
          where: {
            createdAt: {
              gte: startOfToday,
              lte: endOfToday,
            },
          },
        }),
      ]);

    return {
      totalPatients,
      todaysAppointments,
      prescriptionsIssued,
    };
  }
}
