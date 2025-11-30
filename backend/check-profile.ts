
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
    const userId = '20509cfa-d1c9-43d5-932e-71f3372563ea';
    console.log(`Checking for user: ${userId}`);

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        console.log('User NOT found!');
        return;
    }
    console.log('User found:', user);

    const profile = await prisma.taliProfile.findUnique({
        where: { userId: userId },
    });

    if (!profile) {
        console.log('TaliProfile NOT found!');
    } else {
        console.log('TaliProfile found:', profile);
    }
}

checkUser()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
