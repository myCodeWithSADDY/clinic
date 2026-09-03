"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type Patient = {
  id: string;
  fullName: string;
  phone: string;
};

type PatientSelectorProps = {
  onSelect: (patient: Patient) => void;
};

export function PatientSelector({ onSelect }: PatientSelectorProps) {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchPatients(value: string) {
    setSearch(value);

    if (!value.trim()) {
      setPatients([]);
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams({
        search: value,
        page: "1",
        limit: "10",
      });

      const res = await fetch(`/api/patients?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to search patients");
      }

      const result = await res.json();

      setPatients(result.data ?? []);
    } catch (error) {
      console.error(error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search patient by name or phone..."
        value={search}
        onChange={(e) => searchPatients(e.target.value)}
      />

      <div className="max-h-80 space-y-2 overflow-y-auto">
        {loading && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Searching...
          </p>
        )}

        {!loading && search && patients.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No patients found.
          </p>
        )}

        {patients.map((patient) => (
          <Button
            key={patient.id}
            type="button"
            variant="outline"
            className="h-auto w-full justify-start p-4"
            onClick={() => onSelect(patient)}
          >
            <div className="text-left">
              <p className="font-medium">{patient.fullName}</p>
              <p className="text-sm text-muted-foreground">{patient.phone}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
