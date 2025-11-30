/*
  Warnings:

  - Added the required column `premium` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Policy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "premium" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "pdfUrl" DROP NOT NULL;
