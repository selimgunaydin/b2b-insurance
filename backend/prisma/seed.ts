import { PrismaClient, Role, InsuranceType, MembershipType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Create Admin User
    const adminEmail = 'admin@b2b.com';
    const adminPassword = await bcrypt.hash('123123Se*', 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: adminPassword,
            role: Role.ADMIN,
            isApproved: true,
        },
    });

    console.log({ admin });

    // Create Commission Rates
    const insuranceTypes = [
        InsuranceType.TRAFIK,
        InsuranceType.KASKO,
        InsuranceType.SAGLIK,
        InsuranceType.DASK,
        InsuranceType.KONUT,
    ];

    const membershipTypes = [
        MembershipType.STANDARD,
        MembershipType.PREMIUM,
    ];

    for (const mType of membershipTypes) {
        for (const iType of insuranceTypes) {
            let rate = 5.0; // Base rate
            if (mType === MembershipType.PREMIUM) rate += 2.0;
            if (iType === InsuranceType.SAGLIK || iType === InsuranceType.KONUT) rate += 3.0;

            await prisma.commissionRate.upsert({
                where: {
                    membershipType_insuranceType: {
                        membershipType: mType,
                        insuranceType: iType,
                    },
                },
                update: {},
                create: {
                    membershipType: mType,
                    insuranceType: iType,
                    rate: rate,
                },
            });
        }
    }

    console.log('Commission rates seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
