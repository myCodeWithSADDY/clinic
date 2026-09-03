// app/dashboard/appointments/new/page.tsx
"use client";

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BasicScheduler } from "calendarkit-basic";
import type { CalendarEvent, ViewType } from "calendarkit-basic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAppointmentAction } from "../actions";

type PatientSummary = {
  id: string;
  fullName: string;
  phone: string;
};

export default function NewAppointmentPage() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId"); // present = existing patient, absent = walk-in

  const [state, formAction, isPending] = useActionState(
    createAppointmentAction,
    null,
  );

  const [patient, setPatient] = useState<PatientSummary | null>(null);
  const [view, setView] = useState<ViewType>("month");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (!patientId) return;
    fetch(`/api/patients/${patientId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setPatient)
      .catch(() => setPatient(null));
  }, [patientId]);

  useEffect(() => {
    const from = new Date(calendarDate);
    from.setDate(from.getDate() - 7);
    const to = new Date(calendarDate);
    to.setDate(to.getDate() + 7);

    fetch(`/api/appointments?from=${from.toISOString()}&to=${to.toISOString()}`)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((result) => {
        const mapped: CalendarEvent[] = result.data.map((appt: any) => ({
          id: appt.id,
          title: appt.patient?.fullName ?? appt.walkInName ?? "Booked",
          start: new Date(appt.startTime),
          end: new Date(new Date(appt.startTime).getTime() + 30 * 60 * 1000),
          color: "#94a3b8",
        }));
        setEvents(mapped);
      })
      .catch(() => setEvents([]));
  }, [calendarDate]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Book Appointment</h1>
        <p className="text-sm text-muted-foreground">
          {patientId
            ? patient
              ? `For ${patient.fullName} · ${patient.phone}`
              : "Loading patient..."
            : "Walk-in booking -- click the create button on the calendar to start."}
        </p>
      </div>

      <BasicScheduler
        events={events}
        view={view}
        onViewChange={setView}
        date={calendarDate}
        onDateChange={setCalendarDate}
        renderEventForm={({ isOpen, onClose, initialDate }) => (
          <AppointmentFormDialog
            isOpen={isOpen}
            onClose={onClose}
            initialDate={initialDate}
            patientId={patientId}
            formAction={formAction}
            state={state}
            isPending={isPending}
          />
        )}
      />
    </div>
  );
}

type AppointmentState = { error?: string } | null;

function AppointmentFormDialog({
  isOpen,
  onClose,
  initialDate,
  patientId,
  formAction,
  state,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  patientId: string | null;
  formAction: (formData: FormData) => void;
  state: AppointmentState;
  isPending: boolean;
}) {
  const [service, setService] = useState("CONSULTATION");
  const [appointmentType, setAppointmentType] = useState("REGULAR_CHECKUP");
  const [walkInGender, setWalkInGender] = useState("MALE");

  function handleSubmit(formData: FormData) {
    if (!initialDate) return;
    formData.set("date", initialDate.toISOString());
    formData.set("startTime", initialDate.toISOString());
    formData.set("service", service);
    formData.set("appointmentType", appointmentType);
    if (!patientId) {
      formData.set("walkInGender", walkInGender);
    }
    formAction(formData);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          {initialDate && (
            <DialogDescription>
              {initialDate.toLocaleString("en-PK", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
              })}
            </DialogDescription>
          )}
        </DialogHeader>

        <form action={handleSubmit} className="flex flex-col gap-4">
          {patientId && (
            <input type="hidden" name="patientId" value={patientId} />
          )}

          {state?.error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </div>
          )}

          {!patientId && (
            <div className="rounded-md border p-3">
              <p className="mb-3 text-sm font-medium">
                Walk-in Patient Details
              </p>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="walkInName">Full Name</Label>
                  <Input
                    id="walkInName"
                    name="walkInName"
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="walkInPhone">Phone</Label>
                  <Input
                    id="walkInPhone"
                    name="walkInPhone"
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Gender</Label>
                    <Select
                      value={walkInGender}
                      onValueChange={setWalkInGender}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="walkInAge">Age</Label>
                    <Input
                      id="walkInAge"
                      name="walkInAge"
                      disabled={isPending}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Service</Label>
            <Select
              value={service}
              onValueChange={setService}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONSULTATION">Consultation</SelectItem>
                <SelectItem value="MEDICINE">Medicine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Appointment Type</Label>
            <Select
              value={appointmentType}
              onValueChange={setAppointmentType}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REGULAR_CHECKUP">Regular Checkup</SelectItem>
                <SelectItem value="TELEMEDICINE">Telemedicine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="complaints">Complaints / Reason</Label>
            <Textarea
              id="complaints"
              name="complaints"
              rows={2}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={2} disabled={isPending} />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
