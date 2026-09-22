/*
  Warnings:

  - A unique constraint covering the columns `[oldMrNo]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "oldMrNo" TEXT,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_oldMrNo_key" ON "Patient"("oldMrNo");
