import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Account, Prisma } from '@prisma/client';

@Injectable()
export class AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(data: CreateAccountDto): Promise<Account> {
    return this.prisma.account.create({
      data,
    });
  }

  async findAllAccount(filter?: { is_delete?: boolean }): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: {
        is_delete: filter?.is_delete ?? false,
      },
    });
  }

  async findAccountById(
    id: number,
    filter?: { is_delete: boolean },
  ): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: {
        id,
        is_delete: filter?.is_delete ?? false,
      },
    });
  }

  async updateAccount(id: number, data: UpdateAccountDto): Promise<Account> {
    await this.findAccountById(id);
    return this.prisma.account.update({
      where: { id },
      data: data,
    });
  }

  async softDeleteAccount(id: number): Promise<Account> {
    await this.findAccountById(id);
    return this.prisma.account.update({
      where: { id },
      data: {
        is_delete: true,
      },
    });
  }

  async restoreAccount(id: number): Promise<Account> {
    await this.findAccountById(id, { is_delete: true });
    return this.prisma.account.update({
      where: { id },
      data: {
        is_delete: false,
      },
    });
  }

  async hardDeleteUser(): Promise<Prisma.BatchPayload> {
    return this.prisma.account.deleteMany({
      where: { is_delete: true },
    });
  }
}
