type MedicalRecordData = {
  gender?: "MALE" | "FEMALE";
  dateOfBirth: Date;
  sequence: number;
};

export function generateMedicalRecordId(data: MedicalRecordData) {
  const year = new Date().getFullYear().toString().slice(-2);

  const gender =
    data.gender === "MALE" ? "M" : data.gender === "FEMALE" ? "F" : "U";

  const birthYear = data.dateOfBirth.getFullYear();

  const sequence = data.sequence.toString().padStart(5, "0");

  return `MR-${year}-${gender}-${birthYear}-${sequence}`;
}
