import { notFound } from "next/navigation";
import { formatDate } from "@/app/lib/format-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { PrescriptionService } from "@/app/services/prescription.service";
import { FormDialog } from "@/components/form-dialog";
import EditPrescriptionForm from "@/components/edit/edit-prescription-form";


type PageProps = {
  params: Promise<{
    id: string;
  }>;
};



function Vital({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value || "-"}</p>
    </div>
  );
}

export default async function PrescriptionViewPage({ params }: PageProps) {
  const { id } = await params;
   const prescription = await (async () => {
     try {
       return await PrescriptionService.findOne(id);
     } catch (error) {
       if (
         error instanceof Error &&
         error.message === "PRESCRIPTION_NOT_FOUND"
       ) {
         notFound();
       }

       throw error;
     }
   })();

 

  return (
    <div className=" w-full max-w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/prescriptions">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-semibold">Prescription</h1>

            <p className="text-sm text-muted-foreground">
              Created {formatDate(prescription.createdAt)}
            </p>
          </div>
        </div>

        <FormDialog
          trigger={
            <Button>
              <Pencil className="mr-2 size-4" />
              Edit
            </Button>
          }
          title="Edit Prescription"
          description="Update prescription information."
        >
          {(close) => (
            <EditPrescriptionForm
              prescription={{
                ...prescription,

                since: prescription.since.toISOString(),
                createdAt: prescription.createdAt.toISOString(),
                updatedAt: prescription.updatedAt.toISOString(),

                medications: prescription.medications.map((medication) => ({
                  ...medication,
                  createdAt: medication.createdAt.toISOString(),
                })),
              }}
              onSuccess={() => {
                close();
              }}
            />
          )}
        </FormDialog>
      </div>

      {/* Patient */}
      <Card>
        <CardHeader>
          <CardTitle>Patient</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{prescription.patient.fullName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{prescription.patient.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnosis</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Diagnosis</p>
              <p className="font-medium">{prescription.diagnosis}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Disease</p>
              <p className="font-medium">{prescription.disease}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Symptoms</p>
            <p className="whitespace-pre-wrap">{prescription.symptoms}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Since</p>
            <p className="font-medium">{formatDate(prescription.since)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Vitals</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            <Vital label="Blood Pressure" value={prescription.bp} />
            <Vital label="Pulse" value={prescription.pulse} />
            <Vital label="Temperature (F)" value={prescription.tempF} />
            <Vital label="Weight" value={prescription.weight} />
            <Vital label="Sugar" value={prescription.sugar} />
            <Vital label="SpO₂" value={prescription.spo2} />
            <Vital label="Respiratory Rate" value={prescription.rr} />
          </div>
        </CardContent>
      </Card>

      {/* Clinical Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Notes</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="whitespace-pre-wrap">{prescription.clinicalNotes}</p>
        </CardContent>
      </Card>

      {/* Medications */}
      <Card>
        <CardHeader>
          <CardTitle>Medications ({prescription.medications.length})</CardTitle>
        </CardHeader>

        <CardContent>
          {prescription.medications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No medications prescribed.
            </p>
          ) : (
            <div className="space-y-3">
              {prescription.medications.map((medication, index) => (
                <div key={medication.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {index + 1}. {medication.medicine}
                      </p>

                      {medication.insideMedicine && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {medication.insideMedicine}
                        </p>
                      )}
                    </div>

                    <Badge variant="secondary">{medication.medicineType}</Badge>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">Frequency</p>
                    <p className="font-medium">{medication.frequency}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer metadata */}
      <div className="border-t pt-4 text-xs text-muted-foreground">
        <p>Created: {formatDate(prescription.createdAt)}</p>
        <p>Last updated: {formatDate(prescription.updatedAt)}</p>
      </div>
    </div>
  );
}
