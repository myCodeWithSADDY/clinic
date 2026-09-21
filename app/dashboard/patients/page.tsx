// app/dashboard/patients/page.tsx
"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Plus, Trash, View } from "lucide-react";
import { usePaginatedResource } from "@/hooks/use-pagination";
import { ResourceListPage, Column } from "@/components/resource-list";
import { FormDialog } from "@/components/form-dialog";
import { AddPatientForm } from "@/components/create-patient-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/app/lib/format-date";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { removePatientAction } from "./actions";

import { useState } from "react";
import { EditPatientForm } from "@/components/edit/edit-patient-form";
import { useRouter } from "next/navigation";
import { Patient } from "@/app/types/patient.types";




const columns: Column<Patient>[] = [
  {
    header: "Name",
    cell: (p) => <span className="font-medium">{p.fullName}</span>,
  },
  { header: "Phone", cell: (p) => p.phone },
  { header: "Gender", cell: (p) => p.gender },
  { header: "Date of Birth", cell: (p) => formatDate(p.dateOfBirth) },
  { header: "Registered", cell: (p) => formatDate(p.createdAt) },
];

export default function PatientsPage() {
  const router = useRouter()
  const [removeOpen, setRemoveOpen] = useState(false);
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
  } = usePaginatedResource<Patient>("/api/patients");

  return (
    <ResourceListPage
      title="Patients"
      description="Manage your clinic patients."
      addAction={
        <FormDialog
          trigger={
            <Button>
              <Plus className="mr-2 size-4" />
              Add Patient
            </Button>
          }
          title="Add Patient"
          description="Enter the patient's details below."
        >
          {(close) => (
            <AddPatientForm
              onSuccess={() => {
                close();
                refetch();
              }}
            />
          )}
        </FormDialog>
      }
      searchPlaceholder="Search patients..."
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
      emptyTitle="No patients found"
      emptyDescription="Try changing your search or add a new patient."
      renderActions={(patient) => (
        <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/patients/${patient.id}`}>
                  <View className="mr-2 size-4" />
                  View patient
                </Link>
              </DropdownMenuItem>

              <FormDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="mr-2 size-4" />
                    Edit patient
                  </DropdownMenuItem>
                }
                title="Edit Patient"
                description="Update the patient's information."
              >
                {(close) => (
                  <EditPatientForm
                    patient={patient}
                    onSuccess={() => {
                      
                      close();
                      router.refresh();
                    }}
                  />
                )}
              </FormDialog>

              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 size-4" />
                  Remove patient
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove patient?</AlertDialogTitle>

              <AlertDialogDescription>
                This will permanently remove <strong>{patient.fullName}</strong>
                . This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={async (e) => {
                  e.preventDefault();

                  const result = await removePatientAction(patient.id);

                  if (result?.error) {
                    toast.error(result.error);
                    return;
                  }

                  toast.success("Patient removed successfully");

                  setRemoveOpen(false);
                  refetch();
                }}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    />
  );
}
