-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('POLICY_COUNT', 'PREMIUM_TOTAL', 'CUSTOMER_COUNT', 'STREAK', 'SPECIAL');

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT,
    "type" "BadgeType" NOT NULL,
    "criteria" JSONB NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaliBadge" (
    "id" TEXT NOT NULL,
    "taliId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaliBadge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaliBadge_taliId_idx" ON "TaliBadge"("taliId");

-- CreateIndex
CREATE UNIQUE INDEX "TaliBadge_taliId_badgeId_key" ON "TaliBadge"("taliId", "badgeId");

-- AddForeignKey
ALTER TABLE "TaliBadge" ADD CONSTRAINT "TaliBadge_taliId_fkey" FOREIGN KEY ("taliId") REFERENCES "TaliProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaliBadge" ADD CONSTRAINT "TaliBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
