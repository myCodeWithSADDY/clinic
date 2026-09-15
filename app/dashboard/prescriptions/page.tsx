"use client";

import { formatDate } from "@/app/lib/format-date";
import { FormDialog } from "@/components/form-dialog";
import { Column, ResourceListPage } from "@/components/resource-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { usePaginatedResource } from "@/hooks/use-pagination";
import { useCurrentUser } from "@/hooks/use-current-user";
import { MoreHorizontal, Plus, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import EditPrescriptionForm from "@/components/edit/edit-prescription-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { removePrescriptionAction } from "./actions";
import {
  sendPrescriptionToReceptionAction,
  markTaskDoneAction,
} from "../tasks/actions";
import { Prescription } from "@/app/types/prescription.types";

type Patient = {
  id: string;
  fullName: string;
  phone: string;
};

// pendingTaskId is attached server-side by the /api/prescription route
// (see TaskService.findByReferenceIds enrichment) -- add this field to
// your shared Prescription type in app/types/prescription.types.ts too:
//   pendingTaskId?: string;

export default function PrescriptionsPage() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const {
    data,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    pagination,
    refetch,
  } = usePaginatedResource<Prescription>("/api/prescription");

  const [patientSearch, setPatientSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: patients, loading: patientsLoading } =
    usePaginatedResource<Patient>("/api/patients", { limit: 10 });

  const filteredPatients = patients.filter((patient) => {
    const query = patientSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      patient.fullName.toLowerCase().includes(query) ||
      patient.phone.includes(query)
    );
  });

  function handleSelectPatient(patient: Patient, close: () => void) {
    close();
    setPatientSearch("");
    router.push(`/dashboard/prescriptions/new?patientId=${patient.id}`);
  }

  async function handleSendToReception(prescriptionId: string) {
    const result = await sendPrescriptionToReceptionAction(prescriptionId);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success(result.success ?? "Sent to reception");
    refetch();
  }

  async function handleMarkDone(taskId: string) {
    const result = await markTaskDoneAction(taskId);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success(result.success ?? "Marked as done");
    refetch();
  }

  const columns: Column<Prescription>[] = [
    {
      header: "Patient",
      cell: (p) => <span className="font-medium">{p.patient.fullName}</span>,
    },
    { header: "Phone", cell: (p) => p.patient.phone },
    { header: "Diagnosis", cell: (p) => p.diagnosis },
    { header: "Disease", cell: (p) => p.disease },
    { header: "Since", cell: (p) => formatDate(p.since) },
    {
      header: "Medicines",
      cell: (p) =>
        `${p.medications.length} medicine${p.medications.length !== 1 ? "s" : ""}`,
    },
    {
      header: "Handoff",
      cell: (p) =>
        p.pendingTaskId ? (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            Pending
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">--</span>
        ),
    },
    { header: "Created", cell: (p) => formatDate(p.createdAt) },
  ];

  return (
    <ResourceListPage
      title="Prescriptions"
      description="View and manage your clinic prescriptions"
      searchPlaceholder="Search prescriptions..."
      columns={columns}
      data={data}
      getRowKey={(p) => p.id}
      loading={loading}
      error={error}
      search={search}
      onSearchChange={setSearch}
      page={page}
      onPageChange={setPage}
      pagination={pagination}
      emptyTitle="No prescriptions found"
      emptyDescription="No prescriptions have been created yet."
      renderActions={(prescription) => (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {/* View */}
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/prescriptions/${prescription.id}`}>
                  View
                </Link>
              </DropdownMenuItem>

              {user?.role === "DOCTOR" && (
                <FormDialog
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Edit
                    </DropdownMenuItem>
                  }
                  title="Edit Prescription"
                  description="Update the prescription information."
                >
                  {(close) => (
                    <EditPrescriptionForm
                      prescription={prescription}
                      onSuccess={() => {
                        close();
                        router.refresh();
                      }}
                    />
                  )}
                </FormDialog>
              )}

              {/* Doctor: send to reception -- only shown if not already pending */}
              {user?.role === "DOCTOR" && !prescription.pendingTaskId && (
                <DropdownMenuItem
                  onClick={() => handleSendToReception(prescription.id)}
                >
                  <Send className="mr-2 size-4" />
                  Send to Reception
                </DropdownMenuItem>
              )}

              {/* Receptionist: mark the handoff done */}
              {user?.role === "RECEPTIONIST" && prescription.pendingTaskId && (
                <DropdownMenuItem
                  onClick={() => handleMarkDone(prescription.pendingTaskId!)}
                >
                  <CheckCircle2 className="mr-2 size-4" />
                  Mark as Done
                </DropdownMenuItem>
              )}

              {user?.role === "DOCTOR" && (
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete prescription?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the prescription for{" "}
                <strong>{prescription.patient.fullName}</strong>. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={async (e) => {
                  e.preventDefault();
                  const result = await removePrescriptionAction(
                    prescription.id,
                  );
                  if (result?.error) {
                    toast.error(result.error);
                    return;
                  }
                  toast.success("Prescription deleted successfully");
                  setOpen(false);
                  router.refresh();
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      addAction={
        <FormDialog
          trigger={
            <Button>
              <Plus className="mr-2 size-4" />
              Create Prescription
            </Button>
          }
          title="Select Patient"
          description="Search and select the patient for this prescription."
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
                  filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => handleSelectPatient(patient, close)}
                      className="flex w-full items-center justify-between rounded-md border p-3 text-left hover:bg-muted"
                    >
                      <div>
                        <p className="font-medium">{patient.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.phone}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </FormDialog>
      }
    />
  );
}
