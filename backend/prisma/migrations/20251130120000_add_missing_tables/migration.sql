-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'ADMIN_MESSAGE', 'RENEWAL');

-- CreateEnum
CREATE TYPE "GoalTargetType" AS ENUM ('COUNT', 'PREMIUM');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('CASH', 'GIFT');

-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'PAYMENT_REVIEW';

-- DropForeignKey
ALTER TABLE "InsuranceRequest" DROP CONSTRAINT "InsuranceRequest_customerId_fkey";

-- AlterTable
ALTER TABLE "InsuranceRequest" DROP COLUMN "files",
DROP COLUMN "policyPdfUrl",
ADD COLUMN     "offers" JSONB,
ADD COLUMN     "policyUrl" TEXT,
ADD COLUMN     "selectedOffer" JSONB,
ALTER COLUMN "customerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "pdfUrl",
ADD COLUMN     "commission" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "policyUrl" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "PolicyStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "TaliProfile" ADD COLUMN     "allowedInsuranceTypes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "insuranceRequestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceCompany" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetType" "GoalTargetType" NOT NULL,
    "policyType" "InsuranceType",
    "targetValue" INTEGER NOT NULL,
    "rewardType" "RewardType" NOT NULL,
    "rewardValue" DECIMAL(65,30) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaliGoal" (
    "id" TEXT NOT NULL,
    "taliId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "currentValue" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "TaliGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "taliId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceCompany_name_key" ON "InsuranceCompany"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "TaliGoal_taliId_goalId_key" ON "TaliGoal"("taliId", "goalId");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteContent_key_key" ON "WebsiteContent"("key");

-- AddForeignKey
ALTER TABLE "InsuranceRequest" ADD CONSTRAINT "InsuranceRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_insuranceRequestId_fkey" FOREIGN KEY ("insuranceRequestId") REFERENCES "InsuranceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaliGoal" ADD CONSTRAINT "TaliGoal_taliId_fkey" FOREIGN KEY ("taliId") REFERENCES "TaliProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaliGoal" ADD CONSTRAINT "TaliGoal_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_taliId_fkey" FOREIGN KEY ("taliId") REFERENCES "TaliProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

