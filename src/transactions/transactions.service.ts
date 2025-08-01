import { Injectable } from '@nestjs/common';
import { Account, Transaction } from '@prisma/client';
import { AccountsService } from '../accounts/accounts.service';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateTransactionDto } from './dto/req/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountService: AccountsService,
  ) {}

  async findById(id: number): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        source_account: true,
        destination_account: true,
        performed_by_user: true,
      },
    });
  }

  async findAllByAccountId(accountId: number): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { source_account_id: accountId },
          { destination_account_id: accountId },
        ],
      },
      include: {
        source_account: true,
        destination_account: true,
        performed_by_user: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findAllByUserId(userId: number) {
    return this.prisma.transaction.findMany({
      where: {
        performed_by_user_id: userId,
      },
      include: {
        source_account: true,
        destination_account: true,
        performed_by_user: true,
      },
    });
  }

  async createTransaction(
    data: CreateTransactionDto,
    performed_by_user_id: number,
  ) {
    const {
      accountNumber,
      amount,
      type,
      description,
      destinationAccountNumber,
    } = data;

    return this.prisma.$transaction(async () => {
      const sourceAccount: Account =
        await this.accountService.findAccountByAccNumber(accountNumber);

      if (sourceAccount.userId !== performed_by_user_id) {
        throw new Error('You do not have permission to access this account');
      }

      let destinationAccount: Account | null = null;
      let destinationNewBalance: Decimal | null | undefined = null;

      if (type === 'TRANSFER') {
        if (!destinationAccountNumber)
          throw new Error('Destination account number is required');
        destinationAccount = await this.accountService.findAccountByAccNumber(
          destinationAccountNumber,
        );

        if (!destinationAccount)
          throw new Error('Destination account not found');
        if (sourceAccount.id === destinationAccount.id)
          throw new Error('Cannot transfer to the same account');
        if (sourceAccount.balance.lt(amount))
          throw new Error('Insufficient funds');
      }

      let sourceNewBalance = sourceAccount.balance;
      destinationNewBalance = destinationAccount?.balance ?? null;

      if (type === 'DEPOSIT') {
        sourceNewBalance = sourceNewBalance.plus(new Decimal(amount));
      } else if (type === 'WITHDRAW') {
        if (sourceAccount.balance.lt(amount))
          throw new Error('Insufficient funds');
        sourceNewBalance = sourceNewBalance.minus(new Decimal(amount));
      } else if (type === 'TRANSFER' && destinationAccount) {
        sourceNewBalance = sourceNewBalance.minus(new Decimal(amount));
        destinationNewBalance = destinationNewBalance?.plus(
          new Decimal(amount),
        );
      }

      await this.accountService.updateAccount(sourceAccount.id, {
        balance: sourceNewBalance.toNumber(),
        account_type: sourceAccount.account_type,
        is_active: sourceAccount.is_active,
      });

      if (type === 'TRANSFER' && destinationAccount) {
        await this.accountService.updateAccount(destinationAccount.id, {
          balance: destinationNewBalance?.toNumber(),
          account_type: destinationAccount.account_type,
          is_active: destinationAccount.is_active,
        });
      }

      return this.prisma.transaction.create({
        data: {
          type,
          amount,
          description,
          source_account_id: sourceAccount.id,
          destination_account_id: destinationAccount?.id,
          performed_by_user_id,
        },
      });
    });
  }
}
