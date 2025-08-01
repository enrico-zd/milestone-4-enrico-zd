import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/req/create-transaction.dto';
import {
  Account,
  AccountType,
  Role,
  Transaction,
  TransactionType,
  User,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: jest.Mocked<TransactionsService>;

  const mockTransaction: Transaction = {
    id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    type: TransactionType.DEPOSIT,
    amount: new Decimal(100),
    description: 'Test deposit',
    source_account_id: 1,
    destination_account_id: null,
    performed_by_user_id: 1,
  };

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

  const mockUser: User = {
    id: 1,
    full_name: 'test',
    email: 'test@mail.com',
    password: 'hashed',
    role: Role.CUSTOMER,
    created_at: new Date(),
    updated_at: new Date(),
    is_delete: false,
    last_login: new Date(),
    refresh_token: null,
  };

  const mockTransactionWithRelations = {
    id: 1,
    type: TransactionType.DEPOSIT,
    amount: new Decimal(100),
    description: 'Deposit test',
    source_account_id: 1,
    destination_account_id: null,
    performed_by_user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    source_account: mockAccount,
    destination_account: null,
    performed_by_user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            findById: jest.fn(),
            findAllByAccountId: jest.fn(),
            findAllByUserId: jest.fn(),
            createTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get(
      TransactionsService,
    ) as jest.Mocked<TransactionsService>;
  });

  afterEach(() => jest.clearAllMocks());

  describe('findById', () => {
    it('should return transaction by id', async () => {
      service.findById.mockResolvedValue(mockTransaction);

      const result = await controller.findById(1);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('findAllByAccountId', () => {
    it('should return all transactions for account id', async () => {
      service.findAllByAccountId.mockResolvedValue([mockTransaction]);

      const result = await controller.findAllByAccountId(1);

      expect(service.findAllByAccountId).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockTransaction);
    });
  });

  describe('findAllByUserId', () => {
    it('should return all transactions for user id', async () => {
      service.findAllByUserId.mockResolvedValue([mockTransactionWithRelations]);

      const result = await controller.findAllByUserId(mockUser);

      expect(service.findAllByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual([mockTransactionWithRelations]);
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const dto: CreateTransactionDto = {
        accountNumber: '1111',
        amount: 100,
        type: 'DEPOSIT',
        description: 'Test deposit',
      };

      service.createTransaction.mockResolvedValue(mockTransaction);

      const result = await controller.createTransaction(mockUser, dto);

      expect(service.createTransaction).toHaveBeenCalledWith(dto, mockUser.id);
      expect(result).toEqual(mockTransaction);
    });
  });
});
