"use client";

import { useRouter } from "next/navigation";

import { AddPatientForm } from "@/components/create-patient-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewPatientPage() {
  const router = useRouter();

  function handleSuccess() {
    router.push("/dashboard/patients");
    router.refresh();
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Patient</h1>

        <p className="text-sm text-muted-foreground">
          Add a new patient to your clinic.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>

          <CardDescription>
            Enter the patient&apos;s personal and contact information.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AddPatientForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
