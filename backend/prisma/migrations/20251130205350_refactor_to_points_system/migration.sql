/*
  Warnings:

  - The values [CASH,GIFT] on the enum `RewardType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `rewardValue` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `commission` on the `Policy` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `TaliProfile` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `rewardPoints` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `points` to the `Reward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `points` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'COMPLETED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "RewardType_new" AS ENUM ('POINTS');
ALTER TABLE "Goal" ALTER COLUMN "rewardType" TYPE "RewardType_new" USING ("rewardType"::text::"RewardType_new");
ALTER TYPE "RewardType" RENAME TO "RewardType_old";
ALTER TYPE "RewardType_new" RENAME TO "RewardType";
DROP TYPE "public"."RewardType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'MARKET_PURCHASE';

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "rewardValue",
ADD COLUMN     "rewardPoints" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "commission",
ADD COLUMN     "commissionPoints" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "amount",
ADD COLUMN     "points" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "TaliProfile" DROP COLUMN "balance",
ADD COLUMN     "points" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "amount",
ADD COLUMN     "points" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "pointCost" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPurchase" (
    "id" TEXT NOT NULL,
    "taliId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "pointCost" INTEGER NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketPurchase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MarketPurchase" ADD CONSTRAINT "MarketPurchase_taliId_fkey" FOREIGN KEY ("taliId") REFERENCES "TaliProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPurchase" ADD CONSTRAINT "MarketPurchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
