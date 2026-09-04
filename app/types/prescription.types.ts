// app/types/prescription.ts

export type Medication = {
  id: string;
  medicine: string;
  medicineType: string;
  frequency: string;
  insideMedicine: string | null;
  createdAt: string;
};

export type Prescription = {
  id: string;
  patientId: string;
  userId: string;

  diagnosis: string;
  disease: string;
  symptoms: string;
  since: string;

  bp: string | null;
  pulse: string | null;
  tempF: string | null;
  weight: string | null;
  sugar: string | null;
  spo2: string | null;
  rr: string | null;

  clinicalNotes: string;

  createdAt: string;
  updatedAt: string;

  medications: Medication[];

  patient: {
    id: string;
    fullName: string;
    phone: string;
  };
};
