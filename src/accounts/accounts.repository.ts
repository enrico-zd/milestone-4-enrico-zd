import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/req/create-account.dto';
import { UpdateAccountDto } from './dto/req/update-account.dto';
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

  async findAllAccount(
    userId: number,
    filter?: { is_delete?: boolean },
  ): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: {
        AND: [{ is_delete: filter?.is_delete ?? false }, { userId: userId }],
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

  async findAccountByAccNumber(
    account_number: string,
  ): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: {
        account_number: account_number,
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
