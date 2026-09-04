"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PrescriptionForm from "@/components/create-prescription-form";
import { createPrescriptionAction } from "../actions";

function NewPrescriptionPageContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");

  if (!patientId) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No patient selected. Go back to Prescriptions and pick a patient first.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">New Prescription</h1>
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

export default function NewPrescriptionPage() {
  return (
    <Suspense fallback={<div>Loading prescription...</div>}>
      <NewPrescriptionPageContent />
    </Suspense>
  );
}
