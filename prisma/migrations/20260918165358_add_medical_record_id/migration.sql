/*
  Warnings:

  - A unique constraint covering the columns `[medicalRecordId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "medicalRecordId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_medicalRecordId_key" ON "Patient"("medicalRecordId");
