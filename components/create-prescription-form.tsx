"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pill,
  Syringe,
  Droplet,
  FlaskConical,
  Sparkles,
  Package,
  Wind,
  CircleDot,
  Soup,
  Utensils,
  Clock,
  ChevronDown,
  Stethoscope,
  Printer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DatePickerField } from "@/components/date-picker";
import { PrescriptionPreview } from "@/components/prescription-preview";
import type { PrescriptionState } from "@/app/dashboard/prescriptions/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { MEDICINE_TYPE_LABELS, MEDICINE_TYPES } from "@/app/types/medsTypes";
import { chronicDiseaseOptions } from "@/app/lib/chronicDiseaseOptions";

const MEDICINE_TYPE_ICONS: Record<
  (typeof MEDICINE_TYPES)[number],
  React.ElementType
> = {
  CAPSULE: Pill,
  TABLET: Pill,
  INJECTION: Syringe,
  IV: Syringe,
  IM: Syringe,
  IG: Syringe,
  SC: Syringe,
  DROP: Droplet,
  DROPS: Droplet,
  DROPPER: Droplet,
  SOLUTION: FlaskConical,
  SUSPENSION: FlaskConical,
  EMULSION: FlaskConical,
  GEL: Sparkles,
  CREAM: Sparkles,
  LOTION: Sparkles,
  OINTMENT: Sparkles,
  BALM: Sparkles,
  SYRUP: Soup,
  LIQUID: Soup,
  TEASPOON: Soup,
  SACHET: Package,
  POWDER: Package,
  GLOBUS: Package,
  DRAM: Package,
  INHALER: Wind,
  SPRAY: Wind,
  SUPPOSITORY: CircleDot,
  PR: CircleDot,
  SOAP: Sparkles,
  SHAMPOO: Sparkles,
  FACEWASH: Sparkles,
  PO: Utensils,
  SL: Utensils,
  AS_PER_NEED: Clock,
  HALF_HOUR_BEFORE_MEAL: Clock,
  FIVE_TIMES_A_DAY: Clock,
};

type MedicationRow = {
  key: string;
  medicine: string;
  medicineType: string;
  frequency: string;
  insideMedicine: string;
};

function emptyRow(): MedicationRow {
  return {
    key: crypto.randomUUID(),
    medicine: "",
    medicineType: "TABLET",
    frequency: "",
    insideMedicine: "",
  };
}

type PatientSummary = {
  fullName: string;
  phone: string;
  dateOfBirth: string;
  gender: string | null;
};

type PrescriptionFormProps = {
  patientId: string;
  action: (
    prevState: PrescriptionState,
    formData: FormData,
  ) => Promise<PrescriptionState>;
};

function calculateAge(dob: string) {
  const diff = Date.now() - new Date(dob).getTime();

  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export default function PrescriptionForm({
  patientId,
  action,
}: PrescriptionFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(action, null);

  const [patient, setPatient] = useState<PatientSummary | null>(null);

  const [since, setSince] = useState<Date | undefined>(new Date());

  const [medications, setMedications] = useState<MedicationRow[]>([emptyRow()]);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [fields, setFields] = useState({
    diagnosis: "",
    disease: "",
    symptoms: "",
    allergy: "",
    chronicDiseases: [] as string[],
    previousReport: "",
    bp: "",
    pulse: "",
    tempF: "",
    weight: "",
    sugar: "",
    spo2: "",
    rr: "",
    clinicalNotes: "",
    fee: "",
  });

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }

    if (state?.success) {
      toast.success(state.success);
      router.push("/dashboard/prescriptions");
    }
  }, [state, router]);

  useEffect(() => {
    fetch(`/api/patients/${patientId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPatient(data))
      .catch(() => setPatient(null));
  }, [patientId]);

  function updateField(name: keyof typeof fields, value: string) {
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
function toggleChronicDisease(value: string) {
  setFields((prev) => ({
    ...prev,
    chronicDiseases: prev.chronicDiseases.includes(value)
      ? prev.chronicDiseases.filter((item) => item !== value)
      : [...prev.chronicDiseases, value],
  }));
}

  function updateRow(key: string, field: keyof MedicationRow, value: string) {
    setMedications((rows) =>
      rows.map((row) =>
        row.key === key
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );
  }

  function addRow() {
    setMedications((rows) => [...rows, emptyRow()]);
  }

  function removeRow(key: string) {
    setMedications((rows) =>
      rows.length > 1 ? rows.filter((row) => row.key !== key) : rows,
    );
  }

 function handleSubmit(formData: FormData) {
   const payload = medications.map(({ ...rest }) => rest);

   formData.set("medications", JSON.stringify(payload));
   formData.set("since", since ? since.toISOString() : "");
   formData.set("fee", fields.fee);
   formData.set("allergy", fields.allergy);
   formData.set("chronicDiseases", JSON.stringify(fields.chronicDiseases));
formData.set("previousReport", fields.previousReport);
   formAction(formData);
 }

  function handlePrint() {
    window.print();
  }

  const vitalsFilledCount = (
    ["bp", "pulse", "tempF", "weight", "sugar", "spo2", "rr"] as const
  ).filter((key) => fields[key].trim()).length;

  return (
    <div className="w-full">
      {/* Main editor + preview */}
      <div
        className="
          grid
          w-full
          gap-6
          lg:grid-cols-[minmax(0,52fr)_minmax(0,48fr)]
          lg:items-start
          lg:gap-6
        "
      >
        {/* FORM */}
        <form
          action={handleSubmit}
          className="
            flex
            w-full
            flex-col
            gap-4
            print:hidden
          "
        >
          <input type="hidden" name="patientId" value={patientId} />

          {state?.error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </div>
          )}

          {/* DIAGNOSIS */}
          <section className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>

                <Input
                  id="diagnosis"
                  name="diagnosis"
                  required
                  disabled={isPending}
                  value={fields.diagnosis}
                  onChange={(e) => updateField("diagnosis", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="disease">Disease</Label>

                <Input
                  id="disease"
                  name="disease"
                  required
                  disabled={isPending}
                  value={fields.disease}
                  onChange={(e) => updateField("disease", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="symptoms">Symptoms</Label>

              <Textarea
                id="symptoms"
                name="symptoms"
                required
                disabled={isPending}
                rows={2}
                value={fields.symptoms}
                onChange={(e) => updateField("symptoms", e.target.value)}
              />
            </div>

            <DatePickerField
              id="since"
              label="Since"
              value={since}
              onChange={setSince}
              required
              disabled={isPending}
              className="w-full"
            />
          </section>

          <Separator />

          <section className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="allergy">Allergy</Label>

              <Input
                id="allergy"
                name="allergy"
                placeholder="e.g. Penicillin, Dust, None"
                disabled={isPending}
                value={fields.allergy}
                onChange={(e) => updateField("allergy", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <div>
                <Label>Chronic Diseases</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Select all that apply
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3">
                {chronicDiseaseOptions.map((disease) => (
                  <label
                    key={disease.value}
                    htmlFor={`chronic-${disease.value}`}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60"
                  >
                    <Checkbox
                      id={`chronic-${disease.value}`}
                      checked={fields.chronicDiseases.includes(disease.value)}
                      onCheckedChange={() =>
                        toggleChronicDisease(disease.value)
                      }
                      disabled={isPending}
                    />

                    <span>{disease.label}</span>
                  </label>
                ))}
              </div>

              <input
                type="hidden"
                name="chronicDiseases"
                value={JSON.stringify(fields.chronicDiseases)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="previousReport">Previous Report</Label>

              <Textarea
                id="previousReport"
                name="previousReport"
                placeholder="Enter previous medical report findings..."
                disabled={isPending}
                rows={3}
                value={fields.previousReport}
                onChange={(e) => updateField("previousReport", e.target.value)}
              />
            </div>
          </section>

          <Separator />
          {/* VITALS */}
          <section>
            <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-md
                    border
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    hover:bg-muted
                  "
                >
                  <span className="flex items-center gap-2">
                    <Stethoscope className="size-4 text-muted-foreground" />
                    Vitals & Clinical Notes
                    {vitalsFilledCount > 0 && (
                      <span className="text-xs font-normal text-muted-foreground">
                        ({vitalsFilledCount} vital
                        {vitalsFilledCount !== 1 ? "s" : ""} added)
                      </span>
                    )}
                  </span>

                  <ChevronDown
                    className="
                      size-4
                      text-muted-foreground
                      transition-transform
                      data-[state=open]:rotate-180
                    "
                  />
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-4 flex flex-col gap-4">
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Vitals (optional)
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {(
                      [
                        "bp",
                        "pulse",
                        "tempF",
                        "weight",
                        "sugar",
                        "spo2",
                        "rr",
                      ] as const
                    ).map((key) => (
                      <div key={key} className="grid gap-1">
                        <Label
                          htmlFor={key}
                          className="text-xs text-muted-foreground"
                        >
                          {key === "tempF" ? "Temp (F)" : key.toUpperCase()}
                        </Label>

                        <Input
                          id={key}
                          name={key}
                          disabled={isPending}
                          value={fields[key]}
                          onChange={(e) => updateField(key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Label htmlFor="clinicalNotes">
                    Clinical Notes (optional)
                  </Label>

                  <Textarea
                    id="clinicalNotes"
                    name="clinicalNotes"
                    disabled={isPending}
                    rows={3}
                    value={fields.clinicalNotes}
                    onChange={(e) =>
                      updateField("clinicalNotes", e.target.value)
                    }
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </section>

          <Separator />

          {/* MEDICATIONS */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Medications
              </h2>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRow}
                disabled={isPending}
              >
                <Plus className="mr-1 size-3.5" />
                Add Medicine
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {medications.map((row, index) => (
                <div key={row.key} className="rounded-md border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      Medicine {index + 1}
                    </p>

                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(row.key)}
                        className="text-muted-foreground hover:text-destructive"
                        disabled={isPending}
                        aria-label={`Remove medicine ${index + 1}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="grid gap-1">
                      <Label className="text-xs">Medicine Name</Label>

                      <Input
                        value={row.medicine}
                        onChange={(e) =>
                          updateRow(row.key, "medicine", e.target.value)
                        }
                        disabled={isPending}
                        required
                      />
                    </div>

                    <div className="grid gap-1">
                      <Label className="text-xs">Type</Label>

                      <Select
                        value={row.medicineType}
                        onValueChange={(value) =>
                          updateRow(row.key, "medicineType", value)
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue>
                            {(() => {
                              const Icon =
                                MEDICINE_TYPE_ICONS[
                                  row.medicineType as (typeof MEDICINE_TYPES)[number]
                                ];

                              return (
                                <span className="flex items-center gap-2">
                                  {Icon && (
                                    <Icon className="size-3.5 text-muted-foreground" />
                                  )}

                                  {
                                    MEDICINE_TYPE_LABELS[
                                      row.medicineType as (typeof MEDICINE_TYPES)[number]
                                    ]
                                  }
                                </span>
                              );
                            })()}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {MEDICINE_TYPES.map((type) => {
                            const Icon = MEDICINE_TYPE_ICONS[type];

                            return (
                              <SelectItem key={type} value={type}>
                                <span className="flex items-center gap-2">
                                  <Icon className="size-3.5 text-muted-foreground" />
                                  {MEDICINE_TYPE_LABELS[type]}
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-1">
                      <Label className="text-xs">Frequency</Label>

                      <Input
                        value={row.frequency}
                        onChange={(e) =>
                          updateRow(row.key, "frequency", e.target.value)
                        }
                        placeholder="1+1+1"
                        disabled={isPending}
                        required
                      />
                    </div>

                    <div className="grid gap-1">
                      <Label className="text-xs">Note (optional)</Label>

                      <Input
                        value={row.insideMedicine}
                        onChange={(e) =>
                          updateRow(row.key, "insideMedicine", e.target.value)
                        }
                        placeholder="e.g. after meal"
                        disabled={isPending}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* FEE */}
          <section>
            <div className="grid gap-2">
              <Label htmlFor="fee">Fee (optional)</Label>

              <Input
                id="fee"
                name="fee"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 1500"
                disabled={isPending}
                value={fields.fee}
                onChange={(e) => updateField("fee", e.target.value)}
              />
            </div>
          </section>

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Saving..." : "Create Prescription"}
          </Button>
        </form>

        {/* PREVIEW */}
        <div
          id="prescription-print-area"
          className="
            w-full
            min-w-0
            print:fixed
            print:inset-0
            print:w-full
            print:m-0
            print:p-0
            print:bg-white
          "
        >
          {/* Preview header - NOT printed */}
          <div className="mb-2 flex items-center justify-between print:hidden">
            <p className="text-sm font-medium text-muted-foreground">Preview</p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
            >
              <Printer className="mr-1.5 size-3.5" />
              Print
            </Button>
          </div>

          {/* Actual prescription */}
          <div
            id="prescription-preview"
            className="w-full print:m-0 print:w-full"
          >
            <PrescriptionPreview
              patientName={patient?.fullName ?? ""}
              patientPhone={patient?.phone}
              patientAge={
                patient ? calculateAge(patient.dateOfBirth) : undefined
              }
              patientGender={patient?.gender ?? undefined}
              diagnosis={fields.diagnosis}
              disease={fields.disease}
              symptoms={fields.symptoms}
              since={since}
              vitals={{
                bp: fields.bp,
                pulse: fields.pulse,
                tempF: fields.tempF,
                weight: fields.weight,
                sugar: fields.sugar,
                spo2: fields.spo2,
                rr: fields.rr,
              }}
              clinicalNotes={fields.clinicalNotes}
              medications={medications}
              fee={fields.fee}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
