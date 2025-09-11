/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Registration_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Registration_userId_eventId_key" ON "public"."Registration"("userId", "eventId");
