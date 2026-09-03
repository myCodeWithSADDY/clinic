"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerField } from "@/components/date-picker";

type Patient = {
  id: string;
  fullName: string;
  phone: string;
  dateOfBirth: Date;
  gender: "MALE" | "FEMALE" | null;
  weightKg: number | null;
  cnic: string | null;
  houseNo: string | null;
  area: string | null;
  city: string | null;
};

type Props = {
  patient: Patient;
  onSuccess: () => void;
};

export function EditPatientForm({ patient, onSuccess }: Props) {
  const router = useRouter();
    const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    new Date(patient.dateOfBirth),
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!dateOfBirth) {
      setError("Date of birth is required");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      dateOfBirth: dateOfBirth.toISOString(),
      gender: String(formData.get("gender") ?? "") || undefined,
      weightKg: formData.get("weightKg")
        ? Number(formData.get("weightKg"))
        : undefined,
      cnic: String(formData.get("cnic") ?? "") || undefined,
      houseNo: String(formData.get("houseNo") ?? "") || undefined,
      area: String(formData.get("area") ?? "") || undefined,
      city: String(formData.get("city") ?? "") || undefined,
    };

    setLoading(true);

    try {
      const res = await fetch(`/api/patients/${patient.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
console.log(data);
      if (!res.ok) {
  setError(
    data.details?.[0]?.message ||
      data.error ||
      "Failed to update patient",
  );
  return;
}

      onSuccess();
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={patient.fullName}
          required
          disabled={loading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={patient.phone}
            required
            disabled={loading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cnic">CNIC</Label>
          <Input
            id="cnic"
            name="cnic"
            defaultValue={patient.cnic ?? ""}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DatePickerField
          id="dateOfBirth"
          label="Date of Birth"
          value={dateOfBirth}
          onChange={setDateOfBirth}
          required
          disabled={loading}
          className="w-full"
        />

        <div className="grid gap-2">
          <Label htmlFor="gender">Gender</Label>

          <select
            id="gender"
            name="gender"
            defaultValue={patient.gender ?? ""}
            disabled={loading}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">-- Select --</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="weightKg">Weight (kg)</Label>
        <Input
          id="weightKg"
          name="weightKg"
          type="number"
          min="1"
          max="500"
          step="1"
          defaultValue={patient.weightKg ?? ""}
          disabled={loading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="houseNo">House No</Label>
          <Input
            id="houseNo"
            name="houseNo"
            defaultValue={patient.houseNo ?? ""}
            disabled={loading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="area">Area</Label>
          <Input
            id="area"
            name="area"
            defaultValue={patient.area ?? ""}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          name="city"
          defaultValue={patient.city ?? ""}
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
