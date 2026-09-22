// app/dashboard/prescriptions/[id]/invoice/page.tsx
import { notFound } from "next/navigation";
import { PrescriptionService } from "@/app/services/prescription.service";
import { InvoicePreview } from "@/components/invoice-preview";
import { PrintButton } from "@/components/print-button";
import { FeeInput } from "@/components/fee-input";
import { updatePrescriptionFeeAction } from "@/app/dashboard/invoice-actions";


type Props = { params: Promise<{ id: string }> };

export default async function PrescriptionInvoicePage({ params }: Props) {
  const { id } = await params;

  let prescription;
  try {
    prescription = await PrescriptionService.findOne(id);
  } catch (error) {
    if (error instanceof Error && error.message === "PRESCRIPTION_NOT_FOUND") {
      notFound();
    }
    throw error;
  }

  const fee = prescription.fee ? Number(prescription.fee) : 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-lg items-center justify-between print:hidden">
        <div>
          <h1 className="text-xl font-semibold">Invoice</h1>
          <p className="text-sm text-muted-foreground">
            Set the fee below, then print.
          </p>
        </div>
        <PrintButton />
      </div>

      <div className="w-full max-w-lg print:hidden">
        <FeeInput
          initialFee={prescription.fee ? Number(prescription.fee) : null}
          onSave={updatePrescriptionFeeAction.bind(null, id)}
        />
      </div>

      <InvoicePreview
        invoiceNumber={prescription.id.slice(0, 8).toUpperCase()}
        patientName={prescription.patient.fullName}
        patientPhone={prescription.patient.phone ?? undefined}
        date={prescription.createdAt}
        description={`Consultation - ${prescription.diagnosis}`}
        fee={fee}
      />
    </div>
  );
}
