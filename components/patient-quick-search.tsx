"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, UserRound, X } from "lucide-react";
import { Patient } from "@/app/types/patient.types";
import { toast } from "sonner";

export function PatientQuickSearch() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const search = query.trim();

    if (search.length < 2) {
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/patients/search?search=${encodeURIComponent(search)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to search patients");
        }

        setPatients(result.data ?? []);
        setOpen(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Patient search failed:", error);

        setPatients([]);
        setOpen(true);

        toast.error(
          error instanceof Error ? error.message : "Failed to search patients",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const handleChange = (value: string) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setPatients([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    setOpen(true);
  };

  const clearQuery = () => {
    setQuery("");
    setPatients([]);
    setOpen(false);
    setLoading(false);
  };

  return (
    <div className="relative z-[9999] w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

        <input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2) {
              setOpen(true);
            }
          }}
          placeholder="Search patient by name, phone or CNIC..."
          className="h-11 w-full rounded-xl border border-white/20 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-300/30"
        />

        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={clearQuery}
            className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-[9999] mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(33,31,43,0.16)]">
          {loading ? (
            <div className="px-4 py-4 text-sm text-slate-500">
              Searching patients...
            </div>
          ) : patients.length > 0 ? (
            <>
              <div className="max-h-80 overflow-y-auto py-1">
                {patients.map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/dashboard/patients/${patient.id}`}
                    onClick={clearQuery}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-violet-50"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                      <UserRound className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {patient.fullName}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {patient.phone}
                        {patient.cnic ? ` • ${patient.cnic}` : ""}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="border-t border-slate-200 px-4 py-2.5 text-right">
                <Link
                  href="/dashboard/patients"
                  onClick={clearQuery}
                  className="text-xs font-medium text-violet-600 transition hover:text-violet-700"
                >
                  View all patients
                </Link>
              </div>
            </>
          ) : (
            <div className="px-4 py-4">
              <p className="text-sm text-slate-500">No patients found.</p>

              <Link
                href="/dashboard/patients"
                onClick={clearQuery}
                className="mt-2 inline-block text-xs font-medium text-violet-600 hover:text-violet-700"
              >
                View all patients
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
