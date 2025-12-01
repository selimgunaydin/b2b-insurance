-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'OFFER';
ALTER TYPE "NotificationType" ADD VALUE 'POLICY';
ALTER TYPE "NotificationType" ADD VALUE 'CANCELLATION';
ALTER TYPE "NotificationType" ADD VALUE 'PREMIUM';
ALTER TYPE "NotificationType" ADD VALUE 'MARKET';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'WITHDRAWAL';
ALTER TYPE "TransactionType" ADD VALUE 'GOAL_REWARD';

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "description" TEXT;
