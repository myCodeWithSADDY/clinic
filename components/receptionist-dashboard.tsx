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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Reception Desk</h1>
        <p className="text-sm text-muted-foreground">
          Today&apos;s schedule and pending handoffs
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Handoffs
            </CardTitle>
            <ClipboardList className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
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
              {todaysAppointments.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Patients
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/dashboard/appointments/new">
            <Plus className="mr-2 size-4" />
            Book Walk-in
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/patients">
            <Users className="mr-2 size-4" />
            Manage Patients
          </Link>
        </Button>
      </div>

      {/* Pending handoffs -- the main thing a receptionist needs to act on */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Prescription Handoffs</CardTitle>
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
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {prescription?.patient.fullName ?? "Unknown patient"}
                      </p>
                      <p className="text-xs text-muted-foreground">
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

      {/* Today's schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Appointments</CardTitle>
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
                  className="flex items-center justify-between rounded-md border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {appt.patient?.fullName ?? appt.walkInName ?? "--"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appt.service} ·{" "}
                      {appt.appointmentType.replaceAll("_", " ")}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
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
