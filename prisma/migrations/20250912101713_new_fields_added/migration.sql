/*
  Warnings:

  - Added the required column `destination` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Mode" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "destination" TEXT NOT NULL,
ADD COLUMN     "mode" "public"."Mode" NOT NULL;
