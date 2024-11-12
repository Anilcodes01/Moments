/*
  Warnings:

  - You are about to drop the column `caption` on the `Moment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Moment" DROP COLUMN "caption",
ADD COLUMN     "desccription" TEXT;
