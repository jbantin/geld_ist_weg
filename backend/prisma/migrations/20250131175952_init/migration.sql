/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cash" DOUBLE PRECISION NOT NULL DEFAULT 10000,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "portfolio" JSONB,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
