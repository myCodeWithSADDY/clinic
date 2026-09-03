// components/appointment-status-control.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateAppointmentStatusAction } from "@/app/dashboard/appointment/actions";

const STATUSES = [
  "CONFIRMED",
  "CHECKED_IN",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
  "RESCHEDULED",
];

export function AppointmentStatusControl({
  appointmentId,
  currentStatus,
}: {
  appointmentId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  // Auto-hide the "Saved" indicator after a couple seconds
  useEffect(() => {
    if (!justSaved) return;
    const timer = setTimeout(() => setJustSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [justSaved]);

  function handleChange(value: string) {
    const previous = status;
    setStatus(value); // optimistic update
    setError("");
    setJustSaved(false);

    startTransition(async () => {
      const result = await updateAppointmentStatusAction(appointmentId, value);

      if (result?.error) {
        setStatus(previous); // revert on failure
        setError(result.error);
        return;
      }

      // Only confirmed as "saved" once the server actually returns success
      setJustSaved(true);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger className="h-8 w-40 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s.replaceAll("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending && (
        <span className="text-xs text-muted-foreground">Saving...</span>
      )}

      {!isPending && justSaved && (
        <span className="flex items-center gap-1 text-xs text-green-600">
          <Check className="size-3.5" />
          Saved
        </span>
      )}

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
