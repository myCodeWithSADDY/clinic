import { DashboardService } from "@/app/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/revenue-chart";
import { VisitorStats } from "@/components/visitor-stats";
import {
  Users,
  CalendarDays,
  FileText,
  Plus,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { ReceptionistDashboard } from "@/components/receptionist-dashboard";
import { requireAuth } from "../lib/require-auth";
import { PatientQuickSearch } from "@/components/patient-quick-search";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div className="flex flex-col gap-5">
      {/* Hero */}
      <section className="relative z-50 overflow-visible rounded-3xl border border-sky-100 bg-linear-to-br from-sky-50 via-white to-teal-50 px-6 py-6 shadow-[0_14px_36px_rgba(14,116,144,0.08)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:shadow-none sm:px-8">
        <div className="relative z-10 flex flex-col gap-6">
          {/* Heading */}
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              <Activity className="size-3.5" />
              Clinic overview
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Good day, Doctor
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Manage your patients, appointments, and prescriptions from one
              place.
            </p>
          </div>

          {/* Search + Add */}
          <div className="relative z-50 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative z-50 min-w-0 flex-1">
              <PatientQuickSearch />
            </div>

            <Button
              asChild
              size="lg"
              className="h-11 shrink-0 rounded-xl border-0 bg-slate-900 px-5 font-medium text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800"
            >
              <Link href="/dashboard/patients/new">
                <Plus className="mr-2 size-4" />
                Add Patient
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="relative z-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="group border-sky-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(14,116,144,0.1)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Patients
              </CardTitle>
              <p className="mt-1 text-xs text-slate-400">
                Registered in clinic
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 transition-transform group-hover:scale-105">
              <Users className="size-5" />
            </div>
          </CardHeader>

          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              {summary.totalPatients}
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-sky-700">
              Patients
              <ArrowUpRight className="size-3.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="group border-teal-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(13,148,136,0.1)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-medium text-slate-500">
                Today&apos;s Appointments
              </CardTitle>
              <p className="mt-1 text-xs text-slate-400">Scheduled for today</p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 transition-transform group-hover:scale-105">
              <CalendarDays className="size-5" />
            </div>
          </CardHeader>

          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              {summary.appointmentsToday}
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-teal-700">
              Appointments
              <ArrowUpRight className="size-3.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="group border-amber-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(217,119,6,0.1)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-none sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-medium text-slate-500">
                Prescriptions Today
              </CardTitle>
              <p className="mt-1 text-xs text-slate-400">Created today</p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition-transform group-hover:scale-105">
              <FileText className="size-5" />
            </div>
          </CardHeader>

          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              {summary.prescriptionsToday}
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
              Prescriptions
              <ArrowUpRight className="size-3.5" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Analytics */}
      <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(250px,0.65fr)] lg:items-start">
        <RevenueChart data={revenueTrend} />
        <VisitorStats data={visitorStats} />
      </section>
    </div>
  );
}
