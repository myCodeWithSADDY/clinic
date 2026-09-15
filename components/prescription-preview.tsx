
"use client";

type Medication = {
  medicine: string;
  medicineType: string;
  frequency: string;
  insideMedicine: string;
};

type PrescriptionPreviewProps = {
  clinicName?: string;
  doctorName?: string;
  patientName: string;
  patientPhone?: string;
  patientAge?: number | string;
  patientGender?: string;
  diagnosis: string;
  disease: string;
  symptoms: string;
  since: Date | undefined;
  vitals: {
    bp: string;
    pulse: string;
    tempF: string;
    weight: string;
    sugar: string;
    spo2: string;
    rr: string;
  };
  clinicalNotes: string;
  medications: Medication[];
  fee?: string;
};

function formatDate(date: Date | undefined) {
  if (!date) return "--";
  return date.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function PrescriptionPreview({
  clinicName = "Fahad Clinic",
  doctorName = "Dr. Fahad Fayyaz",
  patientName,
  patientPhone,
  patientAge,
  patientGender,
  diagnosis,
  disease,
  symptoms,
  since,
  vitals,
  clinicalNotes,
  medications,
  fee,
}: PrescriptionPreviewProps) {
  const vitalEntries = Object.entries(vitals).filter(([, v]) => v?.trim());
  const vitalLabels: Record<string, string> = {
    bp: "BP",
    pulse: "Pulse",
    tempF: "Temp (F)",
    weight: "Weight",
    sugar: "Sugar",
    spo2: "SpO2",
    rr: "RR",
  };

  return (
    <div className="mx-auto flex min-h-180 w-full max-w-200 flex-col rounded-lg border bg-white p-10 text-sm text-slate-900 shadow-sm print:min-h-screen print:w-full print:max-w-none print:rounded-none print:border-none print:p-8 print:shadow-none">
      {/* Letterhead */}
      <div className="border-b pb-3 text-center">
        <p className="text-lg font-bold">{clinicName}</p>
        <p className="text-xs text-slate-500">{doctorName}</p>
      </div>

      {/* Patient bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-b pb-3 text-xs">
        <div>
          <p className="font-semibold">{patientName || "Patient Name"}</p>
          <p className="text-slate-500">
            {[patientAge && `${patientAge} yrs`, patientGender, patientPhone]
              .filter(Boolean)
              .join(" · ") || "-- "}
          </p>
        </div>
        <p className="text-slate-500">Date: {formatDate(since)}</p>
      </div>

      {/* Diagnosis block */}
      {(diagnosis || disease || symptoms) && (
        <div className="mt-3 space-y-1 border-b pb-3 text-xs">
          {diagnosis && (
            <p>
              <span className="font-semibold">Diagnosis:</span> {diagnosis}
            </p>
          )}
          {disease && (
            <p>
              <span className="font-semibold">Disease:</span> {disease}
            </p>
          )}
          {symptoms && (
            <p>
              <span className="font-semibold">Symptoms:</span> {symptoms}
            </p>
          )}
        </div>
      )}

      {/* Vitals */}
      {vitalEntries.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-b pb-3 text-xs text-slate-600">
          {vitalEntries.map(([key, value]) => (
            <span key={key}>
              <span className="font-medium">{vitalLabels[key]}:</span> {value}
            </span>
          ))}
        </div>
      )}

      {/* Rx symbol + medications */}
      <div className="mt-4 flex-1">
        <p className="mb-2 font-serif text-2xl italic">℞</p>
        {medications.length === 0 ? (
          <p className="text-xs text-slate-400">No medicines added yet</p>
        ) : (
          <ol className="space-y-2 pl-1">
            {medications.map((med, i) => (
              <li key={i} className="text-sm">
                <div className="font-medium">
                  {i + 1}. {med.medicine || "--"}
                </div>
                <div className="pl-4 text-slate-500">
                  {med.frequency}
                  {med.medicineType &&
                    ` (${med.medicineType.replaceAll("_", " ")})`}
                </div>
                {med.insideMedicine && (
                  <span className="block pl-4 text-xs text-slate-500">
                    {med.insideMedicine}
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Clinical notes */}
      {clinicalNotes && (
        <div className="mt-4 border-t pt-3 text-xs">
          <p className="font-semibold">Notes:</p>
          <p className="whitespace-pre-wrap text-slate-600">{clinicalNotes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex items-end justify-between">
        {fee && fee.trim() && (
          <p className="text-sm font-medium">
            Fee: Rs. {Number(fee).toLocaleString("en-PK")}
          </p>
        )}
        <div className="ml-auto text-center text-xs text-slate-500">
          <div className="mb-1 w-32 border-t border-slate-400" />
          Signature
        </div>
      </div>
    </div>
  );
}
