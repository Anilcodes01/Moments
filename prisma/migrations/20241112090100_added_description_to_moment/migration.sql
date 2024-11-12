/*
  Warnings:

  - You are about to drop the column `desccription` on the `Moment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Moment" DROP COLUMN "desccription",
ADD COLUMN     "description" TEXT;
