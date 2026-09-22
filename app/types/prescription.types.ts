// app/types/prescription.ts

export type Medication = {
  id: string;
  medicine: string;
  medicineType: string;
  frequency: string;
  insideMedicine: string | null;
  createdAt: string | Date;
};

export type Prescription = {
  id: string;
  patientId: string;
  userId: string;
  user?: {
    id: string;
    fullName: string;
  }

  diagnosis: string;
  disease: string;
  symptoms: string;
  since: string | Date;

  bp: string | null;
  pulse: string | null;
  tempF: string | null;
  weight: string | null;
  sugar: string | null;
  spo2: string | null;
  rr: string | null;
  allergy: string | null;
  PreviousReport: string | null;
  ChronicDisease: string[];
  clinicalNotes: string | null;

  createdAt: string | Date;
  updatedAt: string | Date;

  medications: Medication[];

  patient?: {
    id: string;
    fullName: string;
    phone: string | null;
  };
  pendingTaskId?: string;
};
