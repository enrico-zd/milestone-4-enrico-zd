import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { InternalServerErrorException } from '@nestjs/common';
import { AccountType, Role, User } from '@prisma/client';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: jest.Mocked<AccountsService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed',
    full_name: 'Test User',
    role: Role.CUSTOMER,
    refresh_token: null,
    last_login: new Date(),
    is_delete: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockAccount = {
    id: 1,
    userId: 1,
    account_number: '123456',
    account_type: AccountType.SAVING,
    balance: 1000,
    is_active: true,
    is_delete: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: {
            createAccount: jest.fn(),
            findAllAccount: jest.fn(),
            findAccountById: jest.fn(),
            updateAccount: jest.fn(),
            softDeleteAccount: jest.fn(),
            restoreAccount: jest.fn(),
            hardDeleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get(AccountsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ---------------- CREATE ----------------
  describe('createAccount', () => {
    it('should create account (happy path)', async () => {
      service.createAccount.mockResolvedValue(mockAccount as any);

      const result = await controller.createAccount({
        userId: 1,
        account_number: '123456',
        account_type: AccountType.SAVING,
        balance: 1000,
      });

      expect(service.createAccount).toHaveBeenCalled();
      expect(result).toEqual(mockAccount);
    });

    it('should throw InternalServerErrorException on error', async () => {
      service.createAccount.mockRejectedValue(new Error('DB Error'));

      await expect(controller.createAccount({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ---------------- FIND ALL ----------------
  describe('findAllAccount', () => {
    it('should return all accounts for user', async () => {
      service.findAllAccount.mockResolvedValue([mockAccount as any]);

      const result = await controller.findAllAccount(mockUser);

      expect(service.findAllAccount).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
    });

    it('should throw InternalServerErrorException on error', async () => {
      service.findAllAccount.mockRejectedValue(new Error('DB Error'));

      await expect(controller.findAllAccount(mockUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ---------------- FIND BY ID ----------------
  describe('findAccountById', () => {
    it('should return account by id', async () => {
      service.findAccountById.mockResolvedValue(mockAccount as any);

      const result = await controller.findAccountById(1);

      expect(service.findAccountById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAccount);
    });

    it('should throw InternalServerErrorException on error', async () => {
      service.findAccountById.mockRejectedValue(new Error('DB Error'));

      await expect(controller.findAccountById(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ---------------- UPDATE ----------------
  describe('updateAccount', () => {
    it('should update and return account', async () => {
      service.updateAccount.mockResolvedValue(mockAccount as any);

      const result = await controller.updateAccount(1, {
        account_type: AccountType.SAVING,
        balance: 2000,
        is_active: true,
      });

      expect(service.updateAccount).toHaveBeenCalledWith(1, {
        account_type: 'SAVING',
        balance: 2000,
        is_active: true,
      } as any);
      expect(result).toEqual(mockAccount);
    });

    it('should throw InternalServerErrorException on error', async () => {
      service.updateAccount.mockRejectedValue(new Error('DB Error'));

      await expect(controller.updateAccount(1, {} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ---------------- SOFT DELETE ----------------
  describe('softDeleteAccount', () => {
    it('should soft delete account', async () => {
      service.softDeleteAccount.mockResolvedValue({
        ...mockAccount,
        is_delete: true,
      } as any);

      const result = await controller.softDeleteAccount(1);

      expect(service.softDeleteAccount).toHaveBeenCalledWith(1);
      expect(result.is_delete).toBe(true);
    });

    it('should throw InternalServerErrorException on error', async () => {
      service.softDeleteAccount.mockRejectedValue(new Error('DB Error'));

      await expect(controller.softDeleteAccount(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ---------------- RESTORE ----------------
  describe('restoreAccount', () => {
    it('should restore account', async () => {
      service.restoreAccount.mockResolvedValue(mockAccount as any);

      const result = await controller.restoreAccount(1);

      expect(service.restoreAccount).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAccount);
    });

    it('should throw InternalServerErrorException on error', async () => {
      service.restoreAccount.mockRejectedValue(new Error('DB Error'));

      await expect(controller.restoreAccount(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ---------------- HARD DELETE ----------------
  describe('hardDeleteUser', () => {
    it('should hard delete accounts', async () => {
      service.hardDeleteUser.mockResolvedValue({
        message: 'Deleted 2 accounts',
      } as any);

      const result = await controller.hardDeleteUser();

      expect(service.hardDeleteUser).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Deleted 2 accounts' });
    });

    it('should throw InternalServerErrorException on error', async () => {
      service.hardDeleteUser.mockRejectedValue(new Error('DB Error'));

      await expect(controller.hardDeleteUser()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
