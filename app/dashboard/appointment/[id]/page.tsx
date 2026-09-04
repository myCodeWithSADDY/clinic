// app/dashboard/appointments/[id]/page.tsx
import { notFound } from "next/navigation";
import { AppointmentService } from "@/app/services/appointment.service";
import { AppointmentStatusControl } from "@/components/appointment-status-control";
import { PatientProfile } from "@/components/user-profile1";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className=" max-w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Appointment Details</h1>
        <p className="text-sm text-muted-foreground">
          Booked on {formatDateTime(appointment.createdAt)}
        </p>
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
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
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
              <div className="col-span-2">
                <p className="text-muted-foreground">Complaints / Reason</p>
                <p className="font-medium">{appointment.complaints}</p>
              </div>
            )}
            {appointment.notes && (
              <div className="col-span-2">
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
