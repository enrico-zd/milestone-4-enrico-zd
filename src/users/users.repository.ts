import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/req/create-user.dto';
import { UserNotFoundRepositoryException } from '../common/exceptions/user-not-found.exception.repository';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findUserById(
    id: number,
    filter?: { is_delete?: boolean },
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        is_delete: filter?.is_delete ?? false,
      },
    });

    if (!user) throw new UserNotFoundRepositoryException();

    return user;
  }

  async findUserByEmail(
    email: string,
    filter?: { is_delete?: boolean },
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
        is_delete: filter?.is_delete ?? false,
      },
    });
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    await this.findUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: data,
    });
  }

  async softDeleteUser(id: number): Promise<User> {
    await this.findUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: {
        is_delete: true,
      },
    });
  }

  async restoreUser(id: number): Promise<User> {
    await this.findUserById(id, { is_delete: true });
    return this.prisma.user.update({
      where: { id },
      data: {
        is_delete: false,
      },
    });
  }

  async hardDeleteUser(id: number): Promise<User> {
    await this.findUserById(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
