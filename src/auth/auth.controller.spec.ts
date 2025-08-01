import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDTO } from './dto/req/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call authService.register and return result', async () => {
      const dto: RegisterDTO = {
        email: 'test@example.com',
        password: 'password123',
        full_name: 'Test User',
        role: 'CUSTOMER', // sesuaikan dengan enum Role kamu
      };

      const mockResult = {
        access_token: 'fake-jwt',
        user: { id: 1, email: dto.email },
      };

      mockAuthService.register.mockResolvedValue(mockResult);

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('login', () => {
    it('should call authService.login and return result', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResult = {
        tokens: { access_token: 'fake-access', refresh_token: 'fake-refresh' },
        user: { id: 1, email: dto.email },
      };

      mockAuthService.login.mockResolvedValue(mockResult);

      const result = await controller.login(dto);

      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });
});
