"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/app/lib/format-date";
import { format } from "date-fns";

type DatePickerFieldProps = {
  id: string;
  label: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  required,
  disabled,
  className = "w-full",
}: DatePickerFieldProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            type="button"
            disabled={disabled}
            className="w-full justify-start font-normal"
          >
            {value ? format(value, "MM/dd/yyyy") : "Select date of birth"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      <input
        type="hidden"
        name={id}
        value={value ? formatDate(value) : "Pick a date"}
        required={required}
      />
    </Field>
  );
}
