/*
  Warnings:

  - Added the required column `social` to the `InstructorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstructorProfile" ADD COLUMN     "social" TEXT NOT NULL;
