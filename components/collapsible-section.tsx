"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";

type Props = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted/40"
      >
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {open ? "Click to collapse" : "Click to expand"}
          </p>
        </div>

        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && <CardContent>{children}</CardContent>}
    </Card>
  );
}
