export type Patient = {
  id: string;
  fullName: string;
  phone: string | null;
  medicalRecordId: string | null;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | null;
  cnic: string | null;
  weightKg: number | null;
  houseNo: string | null;
  area: string | null;
  city: string | null;
  createdAt: string;
};
