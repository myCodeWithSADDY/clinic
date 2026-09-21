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
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <section className="relative z-50 overflow-visible rounded-[30px] bg-linear-to-br from-[#211f2b] via-[#403477] to-[#6d4aff] px-6 py-7 text-white shadow-[0_24px_60px_rgba(64,52,119,0.22)] sm:px-8">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-white/8 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 right-24 size-48 rounded-full bg-violet-300/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-7">
          {/* Heading */}
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-violet-100 backdrop-blur-sm">
              <Activity className="size-3.5" />
              Clinic overview
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Good day, Doctor
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100/80">
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
              className="h-11 shrink-0 rounded-xl border-0 bg-white px-5 font-medium text-[#403477] shadow-lg shadow-black/10 hover:bg-violet-50"
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
        <Card className="group overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_10px_30px_rgba(109,74,255,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(109,74,255,0.1)]">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Patients
              </CardTitle>
              <p className="mt-1 text-xs text-slate-400">
                Registered in clinic
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 transition-transform group-hover:scale-105">
              <Users className="size-5" />
            </div>
          </CardHeader>

          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              {summary.totalPatients}
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-violet-600">
              Patients
              <ArrowUpRight className="size-3.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-[0_10px_30px_rgba(240,106,143,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(240,106,143,0.1)]">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-medium text-slate-500">
                Today&apos;s Appointments
              </CardTitle>
              <p className="mt-1 text-xs text-slate-400">Scheduled for today</p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 transition-transform group-hover:scale-105">
              <CalendarDays className="size-5" />
            </div>
          </CardHeader>

          <CardContent className="flex items-end justify-between">
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              {summary.appointmentsToday}
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-rose-600">
              Appointments
              <ArrowUpRight className="size-3.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-[0_10px_30px_rgba(234,162,74,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(234,162,74,0.1)] sm:col-span-2 lg:col-span-1">
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
      <section className="grid min-w-0 gap-6">
        <RevenueChart data={revenueTrend} />
        <VisitorStats data={visitorStats} />
      </section>
    </div>
  );
}
