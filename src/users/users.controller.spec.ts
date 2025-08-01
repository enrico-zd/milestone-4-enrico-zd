import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    full_name: 'Test User',
    role: 'CUSTOMER',
    is_delete: false,
    created_at: new Date(),
    updated_at: new Date(),
    last_login: new Date(),
    refresh_token: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findUserById: jest.fn(),
            updateUser: jest.fn(),
            softDeleteUser: jest.fn(),
            restoreUser: jest.fn(),
            hardDeleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile (happy path)', async () => {
      service.findUserById.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockUser);

      expect(service.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should throw InternalServerErrorException on error', async () => {
      service.findUserById.mockRejectedValue(new Error('DB error'));

      await expect(controller.getProfile(mockUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update and return user', async () => {
      const dto: UpdateUserDto = { full_name: 'Updated' };
      service.updateUser.mockResolvedValue({
        ...mockUser,
        full_name: 'Updated',
      });

      const result = await controller.updateUser(1, dto);

      expect(service.updateUser).toHaveBeenCalledWith(1, dto);
      expect(result.full_name).toBe('Updated');
    });

    it('should throw InternalServerErrorException on error', async () => {
      service.updateUser.mockRejectedValue(new Error('DB error'));

      await expect(controller.updateUser(1, {})).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('softDelete', () => {
    it('should soft delete user', async () => {
      service.softDeleteUser.mockResolvedValue({
        ...mockUser,
        is_delete: true,
      });

      const result = await controller.softDelete(1);

      expect(service.softDeleteUser).toHaveBeenCalledWith(1);
      expect(result.is_delete).toBe(true);
    });
  });

  describe('restoreUser', () => {
    it('should restore deleted user', async () => {
      service.restoreUser.mockResolvedValue(mockUser);

      const result = await controller.restoreUser(1);

      expect(service.restoreUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('hardDeleteUser', () => {
    it('should hard delete user', async () => {
      service.hardDeleteUser.mockResolvedValue(mockUser);

      const result = await controller.hardDeleteUser(1);

      expect(service.hardDeleteUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });
});
