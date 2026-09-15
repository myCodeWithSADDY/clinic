"use client";

import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/form-dialog";
import EditPrescriptionForm from "./edit-prescription-form";
import { Pencil } from "lucide-react";
import { Prescription } from "@/app/types/prescription.types";

type EditPrescriptionDialogProps = {
  prescription: Prescription;
};

export default function EditPrescriptionDialog({
  prescription,
}: EditPrescriptionDialogProps) {
  return (
    <FormDialog
      trigger={
        <Button className="w-full sm:w-auto">
          <Pencil className="mr-2 size-4" />
          Edit
        </Button>
      }
      title="Edit Prescription"
      description="Update prescription information."
    >
      {(close) => (
        <EditPrescriptionForm prescription={prescription} onSuccess={close} />
      )}
    </FormDialog>
  );
}
