import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';
import { Account, AccountType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('AccountsService', () => {
  let service: AccountsService;
  let repository: jest.Mocked<AccountsRepository>;

  const mockAccount: Account = {
    id: 1,
    userId: 1,
    account_number: '1234567890',
    account_type: AccountType.SAVING,
    balance: new Decimal(1000),
    is_active: true,
    is_delete: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: AccountsRepository,
          useValue: {
            createAccount: jest.fn(),
            findAllAccount: jest.fn(),
            findAccountById: jest.fn(),
            findAccountByAccNumber: jest.fn(),
            updateAccount: jest.fn(),
            softDeleteAccount: jest.fn(),
            restoreAccount: jest.fn(),
            hardDeleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    repository = module.get(AccountsRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('createAccount', () => {
    it('should create an account (happy path)', async () => {
      repository.createAccount.mockResolvedValue(mockAccount);

      const result = await service.createAccount({
        userId: 1,
        account_number: '1234567890',
        account_type: 'SAVING',
        balance: 1000,
      });

      expect(repository.createAccount).toHaveBeenCalled();
      expect(result).toEqual(mockAccount);
    });
  });

  describe('findAllAccount', () => {
    it('should return all accounts for a user', async () => {
      repository.findAllAccount.mockResolvedValue([mockAccount]);

      const result = await service.findAllAccount(1);

      expect(repository.findAllAccount).toHaveBeenCalledWith(1, {
        is_delete: false,
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockAccount);
    });
  });

  describe('findAccountById', () => {
    it('should return account by id', async () => {
      repository.findAccountById.mockResolvedValue(mockAccount);

      const result = await service.findAccountById(1);

      expect(repository.findAccountById).toHaveBeenCalledWith(1, {
        is_delete: false,
      });
      expect(result).toEqual(mockAccount);
    });
  });

  describe('findAccountByAccNumber', () => {
    it('should return account by account number', async () => {
      repository.findAccountByAccNumber.mockResolvedValue(mockAccount);

      const result = await service.findAccountByAccNumber('1234567890');

      expect(repository.findAccountByAccNumber).toHaveBeenCalledWith(
        '1234567890',
      );
      expect(result).toEqual(mockAccount);
    });
  });

  describe('updateAccount', () => {
    it('should update and return account', async () => {
      const updated = { ...mockAccount, account_type: AccountType.CHECKING };
      repository.updateAccount.mockResolvedValue(updated);

      const result = await service.updateAccount(1, {
        account_type: AccountType.CHECKING,
      });

      expect(repository.updateAccount).toHaveBeenCalledWith(1, {
        account_type: AccountType.CHECKING,
      });
      expect(result.account_type).toBe(AccountType.CHECKING);
    });
  });

  describe('softDeleteAccount', () => {
    it('should soft delete an account', async () => {
      repository.softDeleteAccount.mockResolvedValue({
        ...mockAccount,
        is_delete: true,
      });

      const result = await service.softDeleteAccount(1);

      expect(repository.softDeleteAccount).toHaveBeenCalledWith(1);
      expect(result.is_delete).toBe(true);
    });
  });

  describe('restoreAccount', () => {
    it('should restore a soft-deleted account', async () => {
      repository.restoreAccount.mockResolvedValue(mockAccount);

      const result = await service.restoreAccount(1);

      expect(repository.restoreAccount).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAccount);
    });
  });

  describe('hardDeleteUser', () => {
    it('should delete accounts permanently and return message', async () => {
      repository.hardDeleteUser.mockResolvedValue({ count: 2 });

      const result = await service.hardDeleteUser();

      expect(repository.hardDeleteUser).toHaveBeenCalled();
      expect(result.message).toBe('2 accounts permanently deleted');
    });

    it('should throw NotFoundException if no accounts deleted', async () => {
      repository.hardDeleteUser.mockResolvedValue({ count: 0 });

      await expect(service.hardDeleteUser()).rejects.toThrow(NotFoundException);
    });
  });
});
