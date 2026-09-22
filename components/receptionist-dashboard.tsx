// components/receptionist-dashboard.tsx
import Link from "next/link";
import { TaskService } from "@/app/services/task.service";
import { prisma } from "@/app/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarDays, ClipboardList, Plus } from "lucide-react";
import { MarkDoneButton } from "@/components/mark-done-button";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function ReceptionistDashboard() {
  const todayStart = startOfDay(new Date());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const [pendingTasks, todaysAppointments, totalPatients] = await Promise.all([
    TaskService.findForRole("RECEPTIONIST", "PENDING"),
    prisma.appointment.findMany({
      where: { startTime: { gte: todayStart, lt: todayEnd } },
      include: { patient: { select: { fullName: true, phone: true } } },
      orderBy: { startTime: "asc" },
    }),
    prisma.patient.count(),
  ]);

  // Pull prescription details for each pending task so the list is
  // actually useful (patient name, diagnosis), not just raw IDs.
  const prescriptionIds = pendingTasks
    .filter((t) => t.type === "PRESCRIPTION")
    .map((t) => t.referenceId);

  const prescriptions = prescriptionIds.length
    ? await prisma.prescription.findMany({
        where: { id: { in: prescriptionIds } },
        select: {
          id: true,
          diagnosis: true,
          patient: { select: { fullName: true } },
        },
      })
    : [];

  const prescriptionMap = new Map(prescriptions.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-3xl border border-cyan-100 bg-linear-to-br from-cyan-50 via-white to-sky-50 p-6 text-slate-900 shadow-[0_14px_36px_rgba(14,116,144,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Reception desk
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Today&apos;s Operations
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Schedule, patient flow, and pending handoffs in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild className="border-0 bg-slate-900 text-white hover:bg-slate-800">
              <Link href="/dashboard/appointments/new">
                <Plus className="mr-2 size-4" />
                Book Walk-in
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900">
              <Link href="/dashboard/patients">
                <Users className="mr-2 size-4" />
                Manage Patients
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-amber-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Pending Handoffs
            </CardTitle>
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <ClipboardList className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900">{pendingTasks.length}</div>
          </CardContent>
        </Card>

        <Card className="border-cyan-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Today&apos;s Appointments
            </CardTitle>
            <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
              <CalendarDays className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              {todaysAppointments.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Patients
            </CardTitle>
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-slate-900">{totalPatients}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <CardHeader>
          <CardTitle className="text-xl">Pending Prescription Handoffs</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingTasks.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No pending handoffs right now.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {pendingTasks.map((task) => {
                const prescription = prescriptionMap.get(task.referenceId);
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {prescription?.patient.fullName ?? "Unknown patient"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {prescription?.diagnosis ?? "--"} · sent by{" "}
                        {task.createdBy.fullName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                        Pending
                      </Badge>
                      <MarkDoneButton taskId={task.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <CardHeader>
          <CardTitle className="text-xl">Today&apos;s Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {todaysAppointments.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No appointments scheduled for today.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {todaysAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {appt.patient?.fullName ?? appt.walkInName ?? "--"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {appt.service} ·{" "}
                      {appt.appointmentType.replaceAll("_", " ")}
                    </p>
                  </div>
                  <p className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-700">
                    {new Date(appt.startTime).toLocaleTimeString("en-PK", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
