const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting policy URL fix...');

  // Find requests that are COMPLETED but have no policyPdfUrl
  const requests = await prisma.insuranceRequest.findMany({
    where: {
      status: 'COMPLETED',
      policyPdfUrl: null,
    },
  });

  console.log(`Found ${requests.length} requests with missing policy URL.`);

  for (const req of requests) {
    // Find corresponding policy
    const policy = await prisma.policy.findFirst({
      where: {
        insuranceRequestId: req.id,
      },
    });

    if (policy && policy.pdfUrl) {
      console.log(`Fixing request ${req.id} with policy URL: ${policy.pdfUrl}`);
      await prisma.insuranceRequest.update({
        where: { id: req.id },
        data: { policyPdfUrl: policy.pdfUrl },
      });
    } else {
      console.log(`No policy found for request ${req.id}. Reverting status to PAYMENT_REVIEW...`);
      await prisma.insuranceRequest.update({
        where: { id: req.id },
        data: { status: 'PAYMENT_REVIEW' },
      });
    }
  }

  console.log('Fix complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
