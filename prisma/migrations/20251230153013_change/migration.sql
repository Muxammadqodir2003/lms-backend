/*
  Warnings:

  - The `whatsLearn` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `requirements` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "whatsLearn",
ADD COLUMN     "whatsLearn" TEXT[],
DROP COLUMN "requirements",
ADD COLUMN     "requirements" TEXT[];
