import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDTO } from './dto/req/auth.dto';
import { comparePassword } from '../utils/password-hash';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDTO): Promise<{
    access_token: string;
    user: User;
  }> {
    const { email, password, full_name } = registerDto;

    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.createUser({
      email,
      password: hashedPassword,
      full_name: full_name ?? 'Anonymous',
    });

    const token = this.jwtService.sign({
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
      type: 'access',
    });
    return {
      access_token: token,
      user: newUser,
    };
  }

  async login(user: LoginDto): Promise<{
    tokens: {
      access_token: string;
      refresh_token: string;
    };
    user: User;
  }> {
    const { email, password } = user;

    const existingUser = await this.userService.findUserByEmail(email);

    if (!existingUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.userService.updateUser(existingUser.id, {
      last_login: new Date(),
    });

    if (!existingUser.password) {
      throw new UnauthorizedException('Password not set for this user');
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.generateToken({
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    });

    await this.userService.updateUser(existingUser.id, {
      refresh_token: tokens.refresh_token,
    });

    return {
      tokens,
      user: existingUser,
    };
  }

  private async generateToken(user: { id: number; email: string; role: Role }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(
        { ...payload, type: 'refresh' },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
