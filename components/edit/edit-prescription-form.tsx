"use client";

import { useState } from "react";
import type { UpdatePrescriptionInput } from "@/app/validations/prescription.schema";

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

import { MEDICINE_TYPE_LABELS, MEDICINE_TYPES } from "@/app/types/medsTypes";
import { toast } from "sonner";
import { Prescription } from "@/app/types/prescription.types";

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

type Props = {
  prescription: Prescription;
  onSuccess: () => void;
};

function createMedicationRow(
  medication?: Prescription["medications"][number],
): MedicationRow {
  return {
    key: medication?.id ?? crypto.randomUUID(),
    medicine: medication?.medicine ?? "",
    medicineType: medication?.medicineType ?? "TABLET",
    frequency: medication?.frequency ?? "",
    insideMedicine: medication?.insideMedicine ?? "",
  };
}

export default function EditPrescriptionForm({
  prescription,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [since, setSince] = useState<Date | undefined>(
    prescription.since ? new Date(prescription.since) : undefined,
  );

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [fields, setFields] = useState({
    diagnosis: prescription.diagnosis ?? "",
    disease: prescription.disease ?? "",
    symptoms: prescription.symptoms ?? "",
    bp: prescription.bp ?? "",
    pulse: prescription.pulse ?? "",
    tempF: prescription.tempF ?? "",
    weight: prescription.weight ?? "",
    sugar: prescription.sugar ?? "",
    spo2: prescription.spo2 ?? "",
    rr: prescription.rr ?? "",
    clinicalNotes: prescription.clinicalNotes ?? "",
  });

  const [medications, setMedications] = useState<MedicationRow[]>(
    prescription.medications?.length
      ? prescription.medications.map(createMedicationRow)
      : [createMedicationRow()],
  );

  function updateField(name: keyof typeof fields, value: string) {
    setFields((prev) => ({
      ...prev,
      [name]: value,
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
    setMedications((rows) => [...rows, createMedicationRow()]);
  }

  function removeRow(key: string) {
    setMedications((rows) =>
      rows.length > 1 ? rows.filter((row) => row.key !== key) : rows,
    );
  }

  const vitalsFilledCount = (
    ["bp", "pulse", "tempF", "weight", "sugar", "spo2", "rr"] as const
  ).filter((key) => fields[key].trim()).length;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    if (!since) {
      setError("Since date is required");
      setLoading(false);
      return;
    }

    const payload: UpdatePrescriptionInput = {
      diagnosis: fields.diagnosis,
      disease: fields.disease,
      symptoms: fields.symptoms,
      since,

      bp: fields.bp || undefined,
      pulse: fields.pulse || undefined,
      tempF: fields.tempF || undefined,
      weight: fields.weight || undefined,
      sugar: fields.sugar || undefined,
      spo2: fields.spo2 || undefined,
      rr: fields.rr || undefined,

      clinicalNotes: fields.clinicalNotes,

      medications: medications.map((medication) => ({
        medicine: medication.medicine,
        medicineType:
          medication.medicineType as (typeof MEDICINE_TYPES)[number],
        frequency: medication.frequency,
        insideMedicine: medication.insideMedicine || undefined,
      })),
    };

    try {
      const res = await fetch(`/api/prescription/${prescription.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.details?.[0]?.message ||
            data.error ||
            "Failed to update prescription",
        );
         toast.error(data.error || "Failed to update prescription");
        return;
      }
toast.success("Prescription updated successfully");
      onSuccess();
    } catch {
      setError("Could not reach the server. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Diagnosis */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-foreground">Diagnosis</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>

            <Input
              id="diagnosis"
              name="diagnosis"
              required
              disabled={loading}
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
              disabled={loading}
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
            disabled={loading}
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
          disabled={loading}
          className="w-full"
        />
      </section>

      <Separator />

      {/* Clinical Assistants */}
      <section>
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <Stethoscope className="size-4 text-muted-foreground" />
                Clinical Assistants
                {vitalsFilledCount > 0 && (
                  <span className="text-xs font-normal text-muted-foreground">
                    ({vitalsFilledCount} vital
                    {vitalsFilledCount !== 1 ? "s" : ""} added)
                  </span>
                )}
              </span>

              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform ${
                  detailsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4 flex flex-col gap-4">
            {/* Vitals */}
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
                      disabled={loading}
                      value={fields[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Clinical Notes */}
            <div className="grid gap-2">
              <Label htmlFor="clinicalNotes">Clinical Notes</Label>

              <Textarea
                id="clinicalNotes"
                name="clinicalNotes"
                required
                disabled={loading}
                rows={3}
                value={fields.clinicalNotes}
                onChange={(e) => updateField("clinicalNotes", e.target.value)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>

      <Separator />

      {/* Medications */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Medications</h2>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            disabled={loading}
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
                    disabled={loading}
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Medicine */}
                <div className="grid gap-1">
                  <Label className="text-xs">Medicine Name</Label>

                  <Input
                    value={row.medicine}
                    onChange={(e) =>
                      updateRow(row.key, "medicine", e.target.value)
                    }
                    disabled={loading}
                    required
                  />
                </div>

                {/* Type */}
                <div className="grid gap-1">
                  <Label className="text-xs">Type</Label>

                  <Select
                    value={row.medicineType}
                    onValueChange={(value) =>
                      updateRow(row.key, "medicineType", value)
                    }
                    disabled={loading}
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

                {/* Frequency */}
                <div className="grid gap-1">
                  <Label className="text-xs">Frequency</Label>

                  <Input
                    value={row.frequency}
                    onChange={(e) =>
                      updateRow(row.key, "frequency", e.target.value)
                    }
                    placeholder="1+1+1"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Note */}
                <div className="grid gap-1">
                  <Label className="text-xs">Note (optional)</Label>

                  <Input
                    value={row.insideMedicine}
                    onChange={(e) =>
                      updateRow(row.key, "insideMedicine", e.target.value)
                    }
                    placeholder="e.g. after meal"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
