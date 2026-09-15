// app/dashboard/appointments/[id]/invoice/page.tsx

import { notFound } from "next/navigation";

import { AppointmentService } from "@/app/services/appointment.service";
import { InvoicePreview } from "@/components/invoice-preview";
import { PrintButton } from "@/components/print-button";
import { FeeInput } from "@/components/fee-input";
import { updateAppointmentFeeAction } from "@/app/dashboard/invoice-actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AppointmentInvoicePage({ params }: Props) {
  const { id } = await params;

  let appointment;

  try {
    appointment = await AppointmentService.findOne(id);
  } catch (error) {
    if (error instanceof Error && error.message === "APPOINTMENT_NOT_FOUND") {
      notFound();
    }

    throw error;
  }

  const fee = appointment.fee ? Number(appointment.fee) : 0;

  const patientName =
    appointment.patient?.fullName ?? appointment.walkInName ?? "--";

  const patientPhone =
    appointment.patient?.phone ?? appointment.walkInPhone ?? undefined;

  const description = `${appointment.service} - ${appointment.appointmentType.replaceAll(
    "_",
    " ",
  )}`;

  const invoiceNumber = appointment.id.slice(0, 8).toUpperCase();

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Controls */}
      <div className="flex w-full max-w-lg items-center justify-between print:hidden">
        <div>
          <h1 className="text-xl font-semibold">Invoice</h1>

          <p className="text-sm text-muted-foreground">
            Set the fee below, then print the invoice.
          </p>
        </div>

        <PrintButton />
      </div>

      {/* Fee */}
      <div className="w-full max-w-lg print:hidden">
        <FeeInput
          initialFee={appointment.fee ? Number(appointment.fee) : null}
          onSave={updateAppointmentFeeAction.bind(null, id)}
        />
      </div>

      {/* Printable invoice */}
      <div id="invoice-print-area" className="w-full print:m-0 print:w-auto">
        <InvoicePreview
          invoiceNumber={invoiceNumber}
          patientName={patientName}
          patientPhone={patientPhone}
          date={appointment.startTime}
          description={description}
          fee={fee}
        />
      </div>
    </div>
  );
}
