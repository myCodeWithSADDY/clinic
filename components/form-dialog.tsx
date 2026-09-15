"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FormDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: (close: () => void) => React.ReactNode;
};

export function FormDialog({
  trigger,
  title,
  description,
  children,
}: FormDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto sm:w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children(() => setOpen(false))}
      </DialogContent>
    </Dialog>
  );
}
