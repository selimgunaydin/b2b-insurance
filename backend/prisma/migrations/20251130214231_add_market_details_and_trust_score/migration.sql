-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PHYSICAL', 'DIGITAL');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PurchaseStatus" ADD VALUE 'APPROVED';
ALTER TYPE "PurchaseStatus" ADD VALUE 'SHIPPED';
ALTER TYPE "PurchaseStatus" ADD VALUE 'DELIVERED';

-- AlterTable
ALTER TABLE "MarketPurchase" ADD COLUMN     "adminNote" TEXT,
ADD COLUMN     "details" JSONB,
ADD COLUMN     "fulfillmentData" JSONB;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT,
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'PHYSICAL';

-- AlterTable
ALTER TABLE "TaliProfile" ADD COLUMN     "trustScore" INTEGER NOT NULL DEFAULT 100;
