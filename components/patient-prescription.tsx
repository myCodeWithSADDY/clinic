"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";

import { ResourceListPage, Column } from "@/components/resource-list";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Medication = {
  id: string;
  medicine: string;
  medicineType: string;
  frequency: string;
  insideMedicine: string | null;
};

type Prescription = {
  id: string;
  diagnosis: string;
  disease: string;
  symptoms: string;
  clinicalNotes: string;
  since: string | Date;
  createdAt: string | Date;

  medications: Medication[];

  user: {
    id: string;
    fullName: string;
  };
};

function formatDate(date: string | Date) {
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
  {
    header: "Diagnosis",
    cell: (p) => p.diagnosis,
  },
  {
    header: "Disease",
    cell: (p) => p.disease,
  },
  {
    header: "Since",
    cell: (p) => formatDate(p.since),
  },
  {
    header: "Medicines",
    cell: (p) =>
      `${p.medications.length} medicine${
        p.medications.length !== 1 ? "s" : ""
      }`,
  },
  {
    header: "Doctor",
    cell: (p) => p.user.fullName,
  },
  {
    header: "Created",
    cell: (p) => formatDate(p.createdAt),
  },
];

export function PatientPrescriptions({
  patientId,
  patientName,
  prescriptions,
}: {
  patientId: string;
  patientName: string;
  prescriptions: Prescription[];
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  const filteredPrescriptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return prescriptions;
    }

    return prescriptions.filter((prescription) => {
      const medicineNames = prescription.medications
        .map((medication) => medication.medicine)
        .join(" ");

      const searchableText = [
        prescription.id,
        prescription.diagnosis,
        prescription.disease,
        prescription.symptoms,
        prescription.clinicalNotes,
        prescription.user.fullName,
        medicineNames,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [prescriptions, search]);

  /*
   * Pagination is done after filtering.
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPrescriptions.length / limit),
  );

  /*
   * If search reduces the number of pages, make sure
   * we don't remain on an invalid page.
   */
  const currentPage = Math.min(page, totalPages);

  const paginatedPrescriptions = useMemo(() => {
    const start = (currentPage - 1) * limit;
    const end = start + limit;

    return filteredPrescriptions.slice(start, end);
  }, [filteredPrescriptions, currentPage]);

  /*
   * Reset to page 1 whenever the search changes.
   */
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const pagination = {
    total: filteredPrescriptions.length,
    page: currentPage,
    limit,
    totalPages,
  };

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
      data={paginatedPrescriptions}
      getRowKey={(p) => p.id}
      loading={false}
      error={undefined}
      search={search}
      onSearchChange={handleSearchChange}
      page={currentPage}
      onPageChange={setPage}
      pagination={pagination}
      emptyTitle="No prescriptions found"
      emptyDescription={
        search
          ? "No prescriptions match your search."
          : "This patient does not have any prescriptions yet."
      }
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
