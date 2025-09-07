-- CreateTable
CREATE TABLE "public"."Requests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ContactNo" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Requests_email_key" ON "public"."Requests"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Requests_ContactNo_key" ON "public"."Requests"("ContactNo");
