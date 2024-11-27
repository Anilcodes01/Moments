-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Moment" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE';
