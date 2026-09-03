// components/prescription-preview.tsx
"use client";

import { Divide } from "lucide-react";
import { Separator } from "./ui/separator";

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
    <div className="rounded-lg border bg-white p-6 text-sm text-slate-900 shadow-sm">
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
      <div className="mt-4">
        <p className="mb-2 font-serif text-2xl italic">℞</p>
        {medications.length === 0 ? (
          <p className="text-xs text-slate-400">No medicines added yet</p>
        ) : (
          <ol className="space-y-2 pl-1">
            {medications.map((med, i) => (
              <li key={i} className="text-sm p-5">
                <div className="font-medium">
                  {i + 1}. {med.medicine || "--"}
                  <span className="text-sm text-slate-500 pl-4">
                    {med.medicineType &&
                      ` (${med.medicineType.replaceAll("_", " ").toLowerCase()})`}
                  </span>
                </div>
                <div className="pl-4 text-slate-500">{med.frequency}</div>
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
      <div className="mt-8 flex justify-end">
        <div className="text-center text-xs text-slate-500">
          <div className="mb-1 w-32 border-t border-slate-400" />
          Signature
        </div>
      </div>
    </div>
  );
}
