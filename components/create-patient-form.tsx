"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DatePickerField } from "./date-picker";

import { createPatientSchema } from "@/app/validations/patient.schema";

type AddPatientFormProps = {
  onSuccess: () => void;
};

export function AddPatientForm({ onSuccess }: AddPatientFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    const rawData = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      dateOfBirth: String(formData.get("dateOfBirth") ?? ""),
      gender: String(formData.get("gender") ?? "") || undefined,
      weightKg: formData.get("weightKg")
        ? Number(formData.get("weightKg"))
        : undefined,
      cnic: String(formData.get("cnic") ?? "") || undefined,
      houseNo: String(formData.get("houseNo") ?? "") || undefined,
      area: String(formData.get("area") ?? "") || undefined,
      city: String(formData.get("city") ?? "") || undefined,
    };

    const validation = createPatientSchema.safeParse(rawData);

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error?.[0]?.message || data.error || "Failed to create patient",
        );
        return;
      }

      onSuccess();
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

      {/* Full Name */}
      <div className="grid gap-2">
        <Label htmlFor="fullName">Full Name</Label>

        <Input
          id="fullName"
          name="fullName"
          placeholder="Enter patient's full name"
          required
          disabled={loading}
        />
      </div>

      {/* Phone + CNIC */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>

          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="03001234567"
            required
            disabled={loading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cnic">CNIC</Label>

          <Input
            id="cnic"
            name="cnic"
            placeholder="12345-1234567-1"
            disabled={loading}
          />
        </div>
      </div>

      {/* Date of Birth + Gender */}
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
            disabled={loading}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">-- Select --</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
      </div>

      {/* Weight */}
      <div className="grid gap-2">
        <Label htmlFor="weightKg">Weight (kg)</Label>

        <Input
          id="weightKg"
          name="weightKg"
          type="number"
          min="1"
          max="500"
          step="1"
          placeholder="e.g. 75"
          disabled={loading}
        />
      </div>

      {/* Address */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="houseNo">House No</Label>

          <Input
            id="houseNo"
            name="houseNo"
            placeholder="House 123"
            disabled={loading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="area">Area</Label>

          <Input
            id="area"
            name="area"
            placeholder="Model Town"
            disabled={loading}
          />
        </div>
      </div>

      {/* City */}
      <div className="grid gap-2">
        <Label htmlFor="city">City</Label>

        <Input
          id="city"
          name="city"
          placeholder="Bahawalpur"
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? "Creating..." : "Create Patient"}
      </Button>
    </form>
  );
}
