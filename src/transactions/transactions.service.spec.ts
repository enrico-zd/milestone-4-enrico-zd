import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsService } from '../accounts/accounts.service';
import { Decimal } from '@prisma/client/runtime/library';
import {
  Account,
  AccountType,
  Transaction,
  TransactionType,
} from '@prisma/client';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: jest.Mocked<PrismaService>;
  let accountsService: jest.Mocked<AccountsService>;

  const mockAccount: Account = {
    id: 1,
    userId: 1,
    account_number: '1111',
    account_type: AccountType.SAVING,
    balance: new Decimal(1000),
    is_active: true,
    is_delete: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockTransaction: Transaction = {
    id: 1,
    type: TransactionType.DEPOSIT,
    amount: new Decimal(100),
    description: 'Test',
    source_account_id: 1,
    destination_account_id: null,
    performed_by_user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: AccountsService,
          useValue: {
            findAccountByAccNumber: jest.fn(),
            updateAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(TransactionsService);
    prisma = module.get(PrismaService);
    accountsService = module.get(AccountsService);

    // Mock $transaction agar langsung menjalankan callback
    prisma.$transaction.mockImplementation(async (cb: any) => cb());
  });

  afterEach(() => jest.clearAllMocks());

  describe('findById', () => {
    it('should return transaction by id', async () => {
      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await service.findById(1);

      expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          source_account: true,
          destination_account: true,
          performed_by_user: true,
        },
      });
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('createTransaction', () => {
    it('should create a DEPOSIT transaction', async () => {
      accountsService.findAccountByAccNumber.mockResolvedValue(mockAccount);
      (prisma.transaction.create as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await service.createTransaction(
        {
          accountNumber: '1111',
          amount: 100,
          type: 'DEPOSIT',
          description: 'Deposit',
        },
        1,
      );

      expect(accountsService.findAccountByAccNumber).toHaveBeenCalledWith(
        '1111',
      );
      expect(accountsService.updateAccount).toHaveBeenCalledWith(
        1,
        expect.any(Object),
      );
      expect(prisma.transaction.create).toHaveBeenCalled();
      expect(result).toEqual(mockTransaction);
    });

    it('should throw error if user does not own the account', async () => {
      accountsService.findAccountByAccNumber.mockResolvedValue({
        ...mockAccount,
        userId: 2,
      });

      await expect(
        service.createTransaction(
          {
            accountNumber: '1111',
            amount: 100,
            type: TransactionType.DEPOSIT,
            description: 'Deposit',
          },
          1,
        ),
      ).rejects.toThrow('You do not have permission to access this account');
    });

    it('should throw error for insufficient funds on WITHDRAW', async () => {
      accountsService.findAccountByAccNumber.mockResolvedValue({
        ...mockAccount,
        balance: new Decimal(50),
      });

      await expect(
        service.createTransaction(
          {
            accountNumber: '1111',
            amount: 100,
            type: 'WITHDRAW',
            description: 'Withdraw',
          },
          1,
        ),
      ).rejects.toThrow('Insufficient funds');
    });

    it('should throw error if transferring to self', async () => {
      accountsService.findAccountByAccNumber
        .mockResolvedValueOnce(mockAccount) // source
        .mockResolvedValueOnce(mockAccount); // destination

      await expect(
        service.createTransaction(
          {
            accountNumber: '1111',
            destinationAccountNumber: '1111',
            amount: 100,
            type: TransactionType.TRANSFER,
            description: 'Transfer',
          },
          1,
        ),
      ).rejects.toThrow('Cannot transfer to the same account');
    });

    it('should throw error if transfer destination account not found', async () => {
      accountsService.findAccountByAccNumber
        .mockResolvedValueOnce(mockAccount) // source
        .mockResolvedValueOnce(null as any); // destination

      await expect(
        service.createTransaction(
          {
            accountNumber: '1111',
            destinationAccountNumber: '2222',
            amount: 100,
            type: TransactionType.TRANSFER,
            description: 'Transfer',
          },
          1,
        ),
      ).rejects.toThrow('Destination account not found');
    });
  });
});
