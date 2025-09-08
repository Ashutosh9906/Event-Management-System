/*
  Warnings:

  - You are about to drop the column `isTemporaryPassword` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "isTemporaryPassword",
ADD COLUMN     "isPasswordSet" BOOLEAN NOT NULL DEFAULT true;
