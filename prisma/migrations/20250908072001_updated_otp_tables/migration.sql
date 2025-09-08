/*
  Warnings:

  - You are about to drop the `RequestOtp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOtp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."RequestOtp" DROP CONSTRAINT "RequestOtp_requestId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserOtp" DROP CONSTRAINT "UserOtp_userId_fkey";

-- DropTable
DROP TABLE "public"."RequestOtp";

-- DropTable
DROP TABLE "public"."UserOtp";

-- CreateTable
CREATE TABLE "public"."Otp" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_otp_key" ON "public"."Otp"("otp");
