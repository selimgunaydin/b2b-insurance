"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = 'admin@antigravity.com';
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: adminPassword,
            role: client_1.Role.ADMIN,
            isApproved: true,
        },
    });
    console.log({ admin });
    const insuranceTypes = [
        client_1.InsuranceType.TRAFIK,
        client_1.InsuranceType.KASKO,
        client_1.InsuranceType.SAGLIK,
        client_1.InsuranceType.DASK,
        client_1.InsuranceType.KONUT,
    ];
    const membershipTypes = [
        client_1.MembershipType.STANDARD,
        client_1.MembershipType.PREMIUM,
    ];
    for (const mType of membershipTypes) {
        for (const iType of insuranceTypes) {
            let rate = 5.0;
            if (mType === client_1.MembershipType.PREMIUM)
                rate += 2.0;
            if (iType === client_1.InsuranceType.SAGLIK || iType === client_1.InsuranceType.KONUT)
                rate += 3.0;
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
//# sourceMappingURL=seed.js.map