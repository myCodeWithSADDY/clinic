import { ChronicDisease } from "@prisma/client";

export const chronicDiseaseOptions = Object.values(ChronicDisease).map((value) => ({
  value,
  label: value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()),
}));
