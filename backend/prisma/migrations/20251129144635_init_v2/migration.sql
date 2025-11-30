-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TALI');

-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "InsuranceType" AS ENUM ('TRAFIK', 'KASKO', 'SAGLIK', 'DASK', 'KONUT');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING_OFFER', 'OFFER_READY', 'PAYMENT_PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'PAYMENT', 'COMMISSION', 'REFUND');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('SUCCESS', 'PENDING');

-- CreateEnum
CREATE TYPE "CancellationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TALI',
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaliProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "tcKimlikNo" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "birthDate" TIMESTAMP(3),
    "membershipType" "MembershipType" NOT NULL DEFAULT 'STANDARD',
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "hasKvkkApproval" BOOLEAN NOT NULL DEFAULT false,
    "hasContractApproval" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TaliProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "taliId" TEXT NOT NULL,
    "tc_kn" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceRequest" (
    "id" TEXT NOT NULL,
    "taliId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" "InsuranceType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING_OFFER',
    "details" JSONB NOT NULL,
    "files" TEXT[],
    "adminOfferPrice" DECIMAL(65,30),
    "adminOfferCompany" TEXT,
    "adminOfferDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "insuranceRequestId" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionRate" (
    "id" TEXT NOT NULL,
    "membershipType" "MembershipType" NOT NULL,
    "insuranceType" "InsuranceType" NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CommissionRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CancellationRequest" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "proofFiles" TEXT[],
    "status" "CancellationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CancellationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TaliProfile_userId_key" ON "TaliProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_tc_kn_key" ON "Customer"("tc_kn");

-- CreateIndex
CREATE UNIQUE INDEX "Policy_insuranceRequestId_key" ON "Policy"("insuranceRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "CommissionRate_membershipType_insuranceType_key" ON "CommissionRate"("membershipType", "insuranceType");

-- CreateIndex
CREATE UNIQUE INDEX "CancellationRequest_policyId_key" ON "CancellationRequest"("policyId");

-- AddForeignKey
ALTER TABLE "TaliProfile" ADD CONSTRAINT "TaliProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_taliId_fkey" FOREIGN KEY ("taliId") REFERENCES "TaliProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceRequest" ADD CONSTRAINT "InsuranceRequest_taliId_fkey" FOREIGN KEY ("taliId") REFERENCES "TaliProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceRequest" ADD CONSTRAINT "InsuranceRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_insuranceRequestId_fkey" FOREIGN KEY ("insuranceRequestId") REFERENCES "InsuranceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CancellationRequest" ADD CONSTRAINT "CancellationRequest_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "InsuranceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
