
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import PrescriptionForm from "@/components/create-prescription-form";
import { createPrescriptionAction } from "../actions";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  ArrowLeft,
  Search,
  UserPlus,
  UserRound,
} from "lucide-react";

type Patient = {
  id: string;
  fullName: string;
  phone: string;
};

function NewPrescriptionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const patientId = searchParams.get("patientId");

  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (patientId) return;

    let cancelled = false;

    fetch("/api/patients")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch patients");
        }

        return res.json();
      })
      .then((result) => {
        if (cancelled) return;

        const data = Array.isArray(result) ? result : result.data;

        setPatients(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (cancelled) return;

        setPatients([]);
      });

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  /*
   * PATIENT SELECTED
   */
  if (patientId) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/dashboard/prescriptions">
              <ArrowLeft className="mr-2 size-4" />
              Back to Prescriptions
            </Link>
          </Button>

          <h1 className="text-2xl font-semibold">
            New Prescription
          </h1>

          <p className="text-sm text-muted-foreground">
            Fill in the diagnosis, vitals, and medications below.
          </p>
        </div>

        <PrescriptionForm
          patientId={patientId}
          action={createPrescriptionAction}
        />
      </div>
    );
  }

  /*
   * LOADING
   */
  if (patients === null) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/dashboard/prescriptions">
              <ArrowLeft className="mr-2 size-4" />
              Back to Prescriptions
            </Link>
          </Button>

          <h1 className="text-2xl font-semibold">
            New Prescription
          </h1>

          <p className="text-sm text-muted-foreground">
            Select a patient to create their prescription.
          </p>
        </div>

        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Loading patients...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * FILTER PATIENTS
   */
  const query = search.toLowerCase().trim();

  const filteredPatients = patients.filter((patient) => {
    if (!query) return true;

    return (
      patient.fullName.toLowerCase().includes(query) ||
      patient.phone.toLowerCase().includes(query)
    );
  });

  /*
   * PATIENT SELECTION
   */
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <Button variant="outline" asChild className="mb-4">
          <Link href="/dashboard/prescriptions">
            <ArrowLeft className="mr-2 size-4" />
            Back to Prescriptions
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              New Prescription
            </h1>

            <p className="text-sm text-muted-foreground">
              Select an existing patient to continue.
            </p>
          </div>

          {/* Patient not found */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Patient not found?
            </span>

            <Button asChild>
              <Link href="/dashboard/patients">
                <UserPlus className="mr-2 size-4" />
                Create New Patient
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Patient list */}
      <Card>
        <CardHeader>
          <CardTitle>Select Patient</CardTitle>

          <CardDescription>
            Search by patient name or phone number.
          </CardDescription>

          <div className="relative pt-2">
            <Search className="absolute left-3 top-4.5 size-4 text-muted-foreground" />

            <Input
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-0">
          <ScrollArea className="h-[min(26rem,60vh)]">
            {filteredPatients.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
                  <UserRound className="size-6 text-muted-foreground" />
                </div>

                <h3 className="font-medium">
                  No patients found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  No patient matches your search. If this patient is
                  new to the clinic, create a new patient record.
                </p>

                <Button asChild className="mt-4">
                  <Link href="/dashboard/patients">
                    <UserPlus className="mr-2 size-4" />
                    Create New Patient
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/dashboard/prescriptions/new?patientId=${patient.id}`,
                      )
                    }
                    className="flex w-full min-w-0 items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none sm:gap-4 sm:px-6"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <UserRound className="size-5 text-muted-foreground" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {patient.fullName}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {patient.phone}
                      </p>
                    </div>

                    <span className="hidden shrink-0 rounded-md px-2 text-sm font-medium text-muted-foreground sm:inline-flex sm:h-9 sm:items-center sm:px-3">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
export default function NewPrescriptionPage() {
  return (
    <Suspense fallback={<div>Loading prescription...</div>}>
      <NewPrescriptionPageContent />
    </Suspense>
  );
}
