
"use client";

type InvoicePreviewProps = {
  invoiceNumber: string;
  clinicName?: string;
  patientName: string;
  patientPhone?: string;
  date: Date;
  description: string; 
  fee: number;
};

export function InvoicePreview({
  invoiceNumber,
  clinicName = "Fahad Clinic",
  patientName,
  patientPhone,
  date,
  description,
  fee,
}: InvoicePreviewProps) {
  return (
    <div className="mx-auto max-w-lg rounded-lg border bg-white p-8 text-sm text-slate-900 shadow-sm print:border-none print:shadow-none">
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <p className="text-lg font-bold">{clinicName}</p>
          <p className="text-xs text-slate-500">Invoice</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>Invoice #{invoiceNumber}</p>
          <p>
            {date.toLocaleDateString("en-PK", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="mt-4 border-b pb-4 text-xs">
        <p className="font-semibold text-slate-700">Billed to</p>
        <p className="mt-1">{patientName}</p>
        {patientPhone && <p className="text-slate-500">{patientPhone}</p>}
      </div>

      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-slate-500">
            <th className="pb-2 font-medium">Description</th>
            <th className="pb-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-3">{description}</td>
            <td className="py-3 text-right">
              Rs. {fee.toLocaleString("en-PK")}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="pt-3 text-right font-semibold">Total</td>
            <td className="pt-3 text-right font-semibold">
              Rs. {fee.toLocaleString("en-PK")}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-8 flex justify-end">
        <div className="text-center text-xs text-slate-500">
          <div className="mb-1 w-32 border-t border-slate-400" />
          Authorized Signature
        </div>
      </div>
    </div>
  );
}
