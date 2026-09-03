// app/dashboard/patients/[id]/page.tsx
import { notFound } from "next/navigation";
import { PatientService } from "@/app/services/patient.service";
import { PatientProfile } from "@/components/user-profile1";
import { PatientPrescriptions } from "@/components/patient-prescription";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PatientPage({ params }: Props) {
  const { id } = await params;

  let patient;
  try {
    patient = await PatientService.findOne(id);
  } catch (error) {
    if (error instanceof Error && error.message === "PATIENT_NOT_FOUND") {
      notFound();
    }
    throw error;
  }

  const patientProfile = {
    ...patient,
    address:
      [patient.houseNo, patient.city].filter(Boolean).join(", ") || null,
    weight: patient.weightKg ?? null,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Patient Profile</h1>
        <p className="text-sm text-muted-foreground">
          View patient information and medical history.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[350px_minmax(0,1fr)]">
        <PatientProfile patient={patientProfile} />
        <PatientPrescriptions
          patientId={patient.id}
          patientName={patient.fullName}
        />
      </div>
    </div>
  );
}
