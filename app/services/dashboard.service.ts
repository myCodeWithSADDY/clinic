// app/services/dashboard.service.ts
import { prisma } from "@/app/lib/prisma";
import { getOrSetCache } from "@/app/lib/cache";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export class DashboardService {

  static async getStats() {
    return this.getSummaryStats();
  }

  static async getSummaryStats() {
    return getOrSetCache("dashboard:summary", 60, async () => {
      const todayStart = startOfDay(new Date());
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      const [totalPatients, appointmentsToday, prescriptionsToday] =
        await Promise.all([
          prisma.patient.count(),
          prisma.appointment.count({
            where: { startTime: { gte: todayStart, lt: todayEnd } },
          }),
          prisma.prescription.count({
            where: { createdAt: { gte: todayStart, lt: todayEnd } },
          }),
        ]);

      return { totalPatients, appointmentsToday, prescriptionsToday };
    });
  }


  static async getRevenueTrend(days = 30) {
    return getOrSetCache(`dashboard:revenue:${days}`, 300, async () => {
      const from = startOfDay(new Date());
      from.setDate(from.getDate() - (days - 1));

      const [appointments, prescriptions] = await Promise.all([
        prisma.appointment.findMany({
          where: { startTime: { gte: from }, fee: { not: null } },
          select: { startTime: true, fee: true },
        }),
        prisma.prescription.findMany({
          where: { createdAt: { gte: from }, fee: { not: null } },
          select: { createdAt: true, fee: true },
        }),
      ]);

      const buckets = new Map<string, number>();
      for (let i = 0; i < days; i++) {
        const d = new Date(from);
        d.setDate(d.getDate() + i);
        buckets.set(dateKey(d), 0);
      }

      for (const a of appointments) {
        const key = dateKey(a.startTime);
        buckets.set(key, (buckets.get(key) ?? 0) + Number(a.fee));
      }
      for (const p of prescriptions) {
        const key = dateKey(p.createdAt);
        buckets.set(key, (buckets.get(key) ?? 0) + Number(p.fee));
      }

      return Array.from(buckets.entries()).map(([date, revenue]) => ({
        date,
        revenue,
      }));
    });
  }


  static async getVisitorStats(days = 30) {
    return getOrSetCache(`dashboard:visitors:${days}`, 300, async () => {
      const from = startOfDay(new Date());
      from.setDate(from.getDate() - (days - 1));

      const appointments = await prisma.appointment.findMany({
        where: { startTime: { gte: from } },
        select: { patientId: true, startTime: true },
      });

      const averagePerDay = appointments.length / days;

      const visitCounts = new Map<string, number>();
      for (const a of appointments) {
        if (!a.patientId) continue;
        visitCounts.set(a.patientId, (visitCounts.get(a.patientId) ?? 0) + 1);
      }

      const uniquePatients = visitCounts.size;
      const repeatedVisitors = Array.from(visitCounts.values()).filter(
        (c) => c > 1,
      ).length;
      const repeatRate =
        uniquePatients > 0 ? (repeatedVisitors / uniquePatients) * 100 : 0;

      return {
        averagePerDay: Math.round(averagePerDay * 10) / 10,
        uniquePatients,
        repeatedVisitors,
        repeatRatePercent: Math.round(repeatRate),
      };
    });
  }


  /// for testing

static async testDashboardStats() {
  console.log("Testing dashboard stats...");

  const stats = await DashboardService.getSummaryStats();

  console.log("Dashboard stats:", stats);

  return stats;
}
}
