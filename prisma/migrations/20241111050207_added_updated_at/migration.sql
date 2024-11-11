/*
  Warnings:

  - Made the column `updatedAt` on table `Media` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);
