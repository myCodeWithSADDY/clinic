// app/dashboard/appointments/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, UserPlus } from "lucide-react";
import { usePaginatedResource } from "@/hooks/use-pagination";
import { ResourceListPage, Column } from "@/components/resource-list";
import { FormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Appointment = {
  id: string;
  patient: { fullName: string; phone: string } | null;
  walkInName: string | null;
  walkInPhone: string | null;
  service: string;
  appointmentType: string;
  startTime: string;
  status: string;
};

type Patient = {
  id: string;
  fullName: string;
  phone: string;
};

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  CHECKED_IN: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  COMPLETED: "bg-green-100 text-green-700 hover:bg-green-100",
  CANCELLED: "bg-red-100 text-red-700 hover:bg-red-100",
  NO_SHOW: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  RESCHEDULED: "bg-amber-100 text-amber-700 hover:bg-amber-100",
};

const columns: Column<Appointment>[] = [
  {
    header: "Patient",
    cell: (a) => (
      <span className="font-medium">
        {a.patient?.fullName ?? a.walkInName ?? "--"}
        {!a.patient && <span className="ml-1 text-xs text-muted-foreground">(walk-in)</span>}
      </span>
    ),
  },
  { header: "Phone", cell: (a) => a.patient?.phone ?? a.walkInPhone ?? "--" },
  { header: "Service", cell: (a) => a.service },
  { header: "Type", cell: (a) => a.appointmentType.replaceAll("_", " ") },
  { header: "Time", cell: (a) => formatDateTime(a.startTime) },
  {
    header: "Status",
    cell: (a) => (
      <Badge className={STATUS_STYLES[a.status] ?? "bg-slate-100 text-slate-700"}>
        {a.status.replaceAll("_", " ")}
      </Badge>
    ),
  },
];
  


export default function AppointmentsPage() {
  const router = useRouter();
  const { data, loading, error, search, setSearch, page, setPage, pagination } =
    usePaginatedResource<Appointment>("/api/appointments");

  const [patientSearch, setPatientSearch] = useState("");
  const { data: patients, loading: patientsLoading } = usePaginatedResource<Patient>(
    "/api/patients",
    { limit: 10 },
  );

  const filteredPatients = patients.filter((p) => {
    const q = patientSearch.toLowerCase().trim();
    if (!q) return true;
    return p.fullName.toLowerCase().includes(q) || p.phone.includes(q);
  });

  function handleSelectPatient(p: Patient, close: () => void) {
    close();
    setPatientSearch("");
    router.push(`/dashboard/appointment/new?patientId=${p.id}`);
  }

  return (
    <ResourceListPage
      title="Appointments"
      description="View and manage clinic appointments."
      searchPlaceholder="Search appointments..."
      columns={columns}
      data={data}
      getRowKey={(a) => a.id}
      loading={loading}
      error={error}
      search={search}
      onSearchChange={setSearch}
      page={page}
      onPageChange={setPage}
      pagination={pagination}
      emptyTitle="No appointments found"
      emptyDescription="No appointments have been booked yet."
      addAction={
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/dashboard/appointment/new">
              <UserPlus className="mr-2 size-4" />
              Book Walk-in
            </Link>
          </Button>

          <FormDialog
            trigger={
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 size-4" />
                Book for Patient
              </Button>
            }
            title="Select Patient"
            description="Search and select the patient for this appointment."
          >
            {(close) => (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="patient-search">Search Patient</Label>
                  <Input
                    id="patient-search"
                    placeholder="Search by name or phone..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-80 space-y-2 overflow-y-auto">
                  {patientsLoading ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      Loading patients...
                    </p>
                  ) : filteredPatients.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No patients found.
                    </p>
                  ) : (
                    filteredPatients.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPatient(p, close)}
                        className="flex w-full items-center justify-between rounded-md border p-3 text-left hover:bg-muted"
                      >
                        <div>
                          <p className="font-medium">{p.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {p.phone}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </FormDialog>
        </div>
      }
      renderActions={(appointment) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/appointment/${appointment.id}`}>
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/appointment/${appointment.id}/invoice`}>
                Print invoice
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
}