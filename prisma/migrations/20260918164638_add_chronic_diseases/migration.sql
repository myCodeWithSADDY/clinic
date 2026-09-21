-- CreateEnum
CREATE TYPE "ChronicDisease" AS ENUM ('DM', 'HTN', 'IHD', 'RA', 'Others');

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "ChronicDisease" "ChronicDisease"[] DEFAULT ARRAY[]::"ChronicDisease"[],
ADD COLUMN     "PreviousReport" TEXT,
ADD COLUMN     "allergy" TEXT;
