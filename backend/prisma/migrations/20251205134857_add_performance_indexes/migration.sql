-- CreateIndex
CREATE INDEX "AuditLog_userId_action_idx" ON "AuditLog"("userId", "action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Customer_taliId_createdAt_idx" ON "Customer"("taliId", "createdAt");

-- CreateIndex
CREATE INDEX "Customer_fullName_idx" ON "Customer"("fullName");

-- CreateIndex
CREATE INDEX "InsuranceRequest_taliId_status_idx" ON "InsuranceRequest"("taliId", "status");

-- CreateIndex
CREATE INDEX "InsuranceRequest_customerId_createdAt_idx" ON "InsuranceRequest"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "InsuranceRequest_type_status_idx" ON "InsuranceRequest"("type", "status");

-- CreateIndex
CREATE INDEX "InsuranceRequest_status_createdAt_idx" ON "InsuranceRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_createdAt_idx" ON "Notification"("userId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_type_createdAt_idx" ON "Notification"("type", "createdAt");

-- CreateIndex
CREATE INDEX "Policy_status_endDate_idx" ON "Policy"("status", "endDate");

-- CreateIndex
CREATE INDEX "Policy_company_idx" ON "Policy"("company");

-- CreateIndex
CREATE INDEX "Transactions_userId_createdAt_idx" ON "Transactions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Transactions_type_status_idx" ON "Transactions"("type", "status");
