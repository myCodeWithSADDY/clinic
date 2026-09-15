
"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FeeInput({
  initialFee,
  onSave,
}: {
  initialFee: number | null;
  onSave: (fee: number) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [value, setValue] = useState(initialFee?.toString() ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setError("");
    setSaved(false);
    const fee = parseFloat(value);

    startTransition(async () => {
      const result = await onSave(fee);
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  return (
    <div className="flex items-center gap-2 print:hidden">
      <Input
        type="number"
        min="0"
        step="0.01"
        placeholder="Enter fee amount"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending}
        className="w-40"
      />
      <Button
        size="sm"
        variant="outline"
        onClick={handleSave}
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save"}
      </Button>
      {saved && (
        <span className="flex items-center gap-1 text-xs text-green-600">
          <Check className="size-3.5" />
          Saved
        </span>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
