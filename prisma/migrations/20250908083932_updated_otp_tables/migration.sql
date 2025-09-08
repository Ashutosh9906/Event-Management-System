/*
  Warnings:

  - You are about to drop the column `isVerified` on the `Requests` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Otp" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Requests" DROP COLUMN "isVerified";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "isVerified";
