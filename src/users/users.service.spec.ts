import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/req/create-user.dto';
import { UpdateUserDto } from './dto/req/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UserRepository>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    full_name: 'Test User',
    role: 'CUSTOMER', // sesuai enum Role di Prisma
    is_delete: false,
    created_at: new Date(),
    updated_at: new Date(),
    last_login: new Date(),
    refresh_token: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn(),
            findUserById: jest.fn(),
            findUserByEmail: jest.fn(),
            updateUser: jest.fn(),
            softDeleteUser: jest.fn(),
            restoreUser: jest.fn(),
            hardDeleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create and return a user (happy path)', async () => {
      const dto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password',
        full_name: 'New User',
        role: 'CUSTOMER',
      };

      repository.createUser.mockResolvedValue(mockUser);

      const result = await service.createUser(dto);
      expect(repository.createUser).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserById', () => {
    it('should return a user when found', async () => {
      repository.findUserById.mockResolvedValue(mockUser);

      const result = await service.findUserById(1);

      expect(repository.findUserById).toHaveBeenCalledWith(1, {
        is_delete: false,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserByEmail', () => {
    it('should return user when email exists', async () => {
      repository.findUserByEmail.mockResolvedValue(mockUser);

      const result = await service.findUserByEmail('test@example.com');

      expect(repository.findUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
        { is_delete: false },
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when email does not exist', async () => {
      repository.findUserByEmail.mockResolvedValue(null);

      const result = await service.findUserByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const dto: UpdateUserDto = { full_name: 'Updated Name' };
      repository.updateUser.mockResolvedValue({
        ...mockUser,
        full_name: 'Updated Name',
      });

      const result = await service.updateUser(1, dto);

      expect(repository.updateUser).toHaveBeenCalledWith(1, dto);
      expect(result.full_name).toBe('Updated Name');
    });
  });

  describe('softDeleteUser', () => {
    it('should call repository and return the soft-deleted user', async () => {
      repository.softDeleteUser.mockResolvedValue({
        ...mockUser,
        is_delete: true,
      });

      const result = await service.softDeleteUser(1);

      expect(repository.softDeleteUser).toHaveBeenCalledWith(1);
      expect(result.is_delete).toBe(true);
    });
  });

  describe('restoreUser', () => {
    it('should call repository and return the restored user', async () => {
      repository.restoreUser.mockResolvedValue(mockUser);

      const result = await service.restoreUser(1);

      expect(repository.restoreUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('hardDeleteUser', () => {
    it('should call repository and return the deleted user', async () => {
      repository.hardDeleteUser.mockResolvedValue(mockUser);

      const result = await service.hardDeleteUser(1);

      expect(repository.hardDeleteUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });
});
