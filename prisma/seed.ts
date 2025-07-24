import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: {
            email: 'john.doe@gmail.com',
            password: 'password',
            full_name: 'John Doe',
            role: 'CUSTOMER',
        }
    });

    const account1 = await prisma.account.create({
        data: {
        userId: user.id,
        account_number: '1234567890',
        balance: 5000,
        account_type: 'SAVING',
        },
    });

    const account2 = await prisma.account.create({
        data: {
        userId: user.id,
        account_number: '0987654321',
        balance: 10000,
        account_type: 'CHECKING',
        },
    });

    await prisma.transaction.createMany({
        data: [
        {
            type: 'DEPOSIT',
            amount: 3000,
            description: 'Initial deposit',
            destination_account_id: account1.id,
            performed_by_user_id: user.id,
        },
        {
            type: 'WITHDRAW',
            amount: 1000,
            description: 'ATM withdrawal',
            source_account_id: account1.id,
            performed_by_user_id: user.id,
        },
        {
            type: 'TRANSFER',
            amount: 2000,
            description: 'Transfer to checking',
            source_account_id: account1.id,
            destination_account_id: account2.id,
            performed_by_user_id: user.id,
        },
        ],
    });
}

main()
    .then(() => console.log('Seeding completed successfully.'))
    .catch((e) => {
        console.error(e),
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })
