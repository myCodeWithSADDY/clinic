"use client"

import { MapPin, Scale, CreditCard, Calendar } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { calculateAge } from "@/app/lib/calculate-age";
import { FormDialog } from "@/components/form-dialog";
import { EditPatientForm } from "@/components/edit/edit-patient-form";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { removePatientAction } from "@/app/dashboard/patients/actions";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Patient } from "@/app/types/patient.types";



interface PatientProfileProps {
  patient: Patient;
  className?: string;
}

const PatientProfile = ({ patient, className }: PatientProfileProps) => {
  const router = useRouter()
    const [removeOpen, setRemoveOpen] = useState(false);
  const initials = patient.fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-0">
        <div className="flex flex-col items-center gap-4 text-center">
          <Avatar className="size-24">
            <AvatarImage
              src={
                patient.gender === "MALE"
                  ? "/avatar-boy.svg"
                  : "/avatar-girl.svg"
              }
              alt={patient.fullName}
              className="object-cover"
            />

            <AvatarFallback className="text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 text-center">
            <h3 className="text-xl font-semibold">{patient.fullName}</h3>

            <Badge variant="secondary" className="text-xs">
              {patient.gender ?? "—"}
            </Badge>

            <p className="text-sm text-muted-foreground">{patient.phone}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <div className="space-y-3 text-sm">
          {/* CNIC */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4" />
              <span>Age</span>
            </div>

            <span className="font-medium">
              {calculateAge(patient.dateOfBirth)} years
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="size-4" />
              <span>CNIC</span>
            </div>

            <span className="font-medium">{patient.cnic || "—"}</span>
          </div>

          {/* Address */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" />
              <span>Address</span>
            </div>

            <span className="max-w-50 text-right font-medium">
              {patient.area || "—"}
            </span>
          </div>

          {/* Weight */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Scale className="size-4" />
              <span>Weight</span>
            </div>

            <span className="font-medium">
              {patient.weightKg != null ? `${patient.weightKg} kg` : "—"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <FormDialog
          trigger={<Button className="flex-1">Edit</Button>}
          title="Edit Patient"
          description="Update the patient's information."
        >
          {(close) => (
            <EditPatientForm
              patient={patient}
              onSuccess={() => {
                close();
              }}
            />
          )}
        </FormDialog>
        <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              Delete
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="destructive">
                Delete patient?
              </AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to permanently delete{" "}
                <strong>{patient.fullName}</strong>?
                <br />
                All patient information associated with this record may be
                deleted. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                variant="destructive"
                onClick={async (e) => {
                  e.preventDefault();

                  const result = await removePatientAction(patient.id);

                  if (result?.error) {
                    toast.error(result.error);
                    return;
                  }

                  toast.success("Patient deleted successfully");

                  setRemoveOpen(false);
                  router.refresh();
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export { PatientProfile };
