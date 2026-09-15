-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_patientId_fkey";

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "fee" DECIMAL(10,2);

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
