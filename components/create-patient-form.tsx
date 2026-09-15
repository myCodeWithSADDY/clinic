"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerField } from "./date-picker";
import {
  createPatientAction,
  PatientState,
} from "@/app/dashboard/patients/actions";

type AddPatientFormProps = {
  onSuccess: () => void;
};

export function AddPatientForm({ onSuccess }: AddPatientFormProps) {
  const [state, formAction, isPending] = useActionState<PatientState, FormData>(
    createPatientAction,
    null,
  );
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [gender, setGender] = useState("");

  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state, onSuccess]);

  function handleSubmit(formData: FormData) {
    formData.set("dateOfBirth", dateOfBirth ? dateOfBirth.toISOString() : "");
    formAction(formData);
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      {state?.error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
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
          disabled={isPending}
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
            disabled={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cnic">CNIC</Label>
          <Input
            id="cnic"
            name="cnic"
            placeholder="12345-1234567-1"
            disabled={isPending}
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
          disabled={isPending}
          className="w-full"
        />

        <div className="grid gap-2">
          <Label htmlFor="gender">Gender</Label>
          <input type="hidden" name="gender" value={gender} />
          <Select value={gender} onValueChange={setGender} disabled={isPending}>
            <SelectTrigger id="gender" className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
            </SelectContent>
          </Select>
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
          disabled={isPending}
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
            disabled={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="area">Area</Label>
          <Input
            id="area"
            name="area"
            placeholder="Model Town"
            disabled={isPending}
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
          disabled={isPending}
        />
      </div>

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? "Creating..." : "Create Patient"}
      </Button>
    </form>
  );
}
