
import { notFound } from "next/navigation";
import { AppointmentService } from "@/app/services/appointment.service";
import { AppointmentStatusControl } from "@/components/appointment-status-control";
import { PatientProfile } from "@/components/user-profile1";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString("en-PK", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}


export default async function AppointmentDetailPage({ params }: Props) {
  const { id } = await params;

  let appointment;
  try {
    appointment = await AppointmentService.findOne(id);
  } catch (error) {
    if (error instanceof Error && error.message === "APPOINTMENT_NOT_FOUND") {
      notFound();
    }
    throw error;
  }

  const isWalkIn = !appointment.patient;

  return (
    <div className="w-full min-w-0 max-w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-semibold">Appointment Details</h1>
        <p className="text-sm text-muted-foreground">
          Booked on {formatDateTime(appointment.createdAt)}
        </p>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={`/dashboard/appointment/${appointment.id}/invoice`}>
            <Printer className="mr-2 size-4" />
            Print Invoice
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[350px_minmax(0,1fr)]">
        {isWalkIn ? (
          <Card>
            <CardHeader>
              <CardTitle>Walk-in Patient</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{appointment.walkInName ?? "--"}</p>
              <p className="text-muted-foreground">
                {appointment.walkInPhone ?? "--"}
              </p>
              <p className="text-muted-foreground">
                {[
                  appointment.walkInGender,
                  appointment.walkInAge && `${appointment.walkInAge} yrs`,
                ]
                  .filter(Boolean)
                  .join(" · ") || "--"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <PatientProfile
            patient={{
              id: appointment.patient!.id,
              fullName: appointment.patient!.fullName,
              phone: appointment.patient!.phone,
              medicalRecordId: appointment.patient!.medicalRecordId,
              dateOfBirth: appointment.patient!.dateOfBirth.toISOString(),
              gender: appointment.patient!.gender,
              cnic: appointment.patient!.cnic,
              weightKg: appointment.patient!.weightKg,
              houseNo: appointment.patient!.houseNo,
              area: appointment.patient!.area,
              city: appointment.patient!.city,
              createdAt: appointment.patient!.createdAt.toISOString(),
            }}
          />
        )}

        {/* Appointment info */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Date & Time</p>
              <p className="font-medium">
                {formatDateTime(appointment.startTime)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Service</p>
              <p className="font-medium">{appointment.service}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-medium">
                {appointment.appointmentType.replaceAll("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <AppointmentStatusControl
                appointmentId={appointment.id}
                currentStatus={appointment.status}
              />
            </div>
            {appointment.complaints && (
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Complaints / Reason</p>
                <p className="font-medium">{appointment.complaints}</p>
              </div>
            )}
            {appointment.notes && (
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Notes</p>
                <p className="font-medium">{appointment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
