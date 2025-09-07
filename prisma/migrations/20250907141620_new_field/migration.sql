/*
  Warnings:

  - Added the required column `organization` to the `Requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Requests" ADD COLUMN     "organization" TEXT NOT NULL;
