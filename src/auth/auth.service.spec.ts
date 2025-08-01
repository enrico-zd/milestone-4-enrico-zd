import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role, User } from '@prisma/client';

// 🔹 Mock bcrypt agar tidak error tipe TS
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed_password',
    full_name: 'Test User',
    role: Role.CUSTOMER,
    is_delete: false,
    created_at: new Date(),
    updated_at: new Date(),
    last_login: new Date(),
    refresh_token: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('jwt-secret'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------- REGISTER ----------------
  describe('register', () => {
    it('should register a new user (happy path)', async () => {
      usersService.findUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      usersService.createUser.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('token');

      const result = await authService.register({
        email: 'test@example.com',
        password: '123456',
        full_name: 'Test User',
        role: Role.CUSTOMER,
      });

      expect(result).toHaveProperty('access_token', 'token');
      expect(result.user).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    });

    it('should throw ConflictException if email exists (edge case)', async () => {
      usersService.findUserByEmail.mockResolvedValue(mockUser);

      await expect(
        authService.register({
          email: 'test@example.com',
          password: '123456',
          full_name: 'Test User',
          role: Role.CUSTOMER,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ---------------- LOGIN ----------------
  describe('login', () => {
    it('should login successfully and return tokens (happy path)', async () => {
      usersService.findUserByEmail.mockResolvedValue({ ...mockUser });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtService.signAsync.mockResolvedValueOnce('access_token');
      jwtService.signAsync.mockResolvedValueOnce('refresh_token');

      const result = await authService.login({
        email: 'test@example.com',
        password: '123456',
      });

      expect(result.tokens.access_token).toBe('access_token');
      expect(result.tokens.refresh_token).toBe('refresh_token');
      expect(result.user).toEqual(mockUser);
      expect(usersService.updateUser).toHaveBeenCalledTimes(2); // last_login + refresh_token
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findUserByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'notfound@example.com',
          password: '123456',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password invalid (boundary)', async () => {
      usersService.findUserByEmail.mockResolvedValue({ ...mockUser });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: 'test@example.com', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
