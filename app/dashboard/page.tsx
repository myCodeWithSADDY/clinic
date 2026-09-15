// app/dashboard/page.tsx
import { DashboardService } from "@/app/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/revenue-chart";
import { VisitorStats } from "@/components/visitor-stats";
import { Users, CalendarDays, FileText } from "lucide-react";
import { ReceptionistDashboard } from "@/components/receptionist-dashboard";
import { requireAuth } from "../lib/require-auth";

export default async function DashboardPage() {
  let role: string | null = null;
  try {
    const payload = await requireAuth();
    role = payload.role as string;
  } catch {
    role = null;
  }

  if (role === "RECEPTIONIST") {
    return <ReceptionistDashboard />;
  }
  const [summary, revenueTrend, visitorStats] = await Promise.all([
    DashboardService.getSummaryStats(),
    DashboardService.getRevenueTrend(30),
    DashboardService.getVisitorStats(30),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your clinic&apos;s activity
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Patients
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalPatients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today&apos;s Appointments
            </CardTitle>
            <CalendarDays className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.appointmentsToday}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prescriptions Today
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.prescriptionsToday}
            </div>
          </CardContent>
        </Card>
      </div>

      <RevenueChart data={revenueTrend} />

      <VisitorStats data={visitorStats} />
    </div>
  );
}
