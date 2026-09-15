
"use client";

import Link from "next/link";
import { MoreHorizontal, Plus } from "lucide-react";
import { usePaginatedResource } from "@/hooks/use-pagination";
import { ResourceListPage, Column } from "@/components/resource-list";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Prescription = {
  id: string;
  diagnosis: string;
  disease: string;
  since: string;
  createdAt: string;
  medications: { id: string }[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const columns: Column<Prescription>[] = [
  {
    header: "Prescription",
    cell: (p) => <span className="font-medium">#{p.id.slice(0, 8)}</span>,
  },
  { header: "Diagnosis", cell: (p) => p.diagnosis },
  { header: "Disease", cell: (p) => p.disease },
  { header: "Since", cell: (p) => formatDate(p.since) },
  {
    header: "Medicines",
    cell: (p) =>
      `${p.medications.length} medicine${p.medications.length !== 1 ? "s" : ""}`,
  },
  { header: "Created", cell: (p) => formatDate(p.createdAt) },
];

export function PatientPrescriptions({
  patientId,
  patientName,
}: {
  patientId: string;
  patientName: string;
}) {

  const { data, loading, error, search, setSearch, page, setPage, pagination } =
    usePaginatedResource<Prescription>(
      `/api/prescription?patientId=${patientId}`,
    );

  return (
    <ResourceListPage
      title="Prescriptions"
      description={`View and manage prescriptions for ${patientName}.`}
      addAction={
        <Button asChild>
          <Link href={`/dashboard/prescriptions/new?patientId=${patientId}`}>
            <Plus className="mr-2 size-4" />
            Create Prescription
          </Link>
        </Button>
      }
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
      emptyDescription="This patient does not have any prescriptions yet."
      renderActions={(prescription) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/prescriptions/${prescription.id}`}>
                View prescription
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/prescriptions/${prescription.id}/edit`}>
                Edit prescription
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/prescriptions/${prescription.id}/invoice`}
              >
                Print invoice
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
}
