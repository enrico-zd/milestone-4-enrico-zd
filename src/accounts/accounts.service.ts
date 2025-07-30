import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/req/create-account.dto';
import { UpdateAccountDto } from './dto/req/update-account.dto';
import { AccountsRepository } from './accounts.repository';
import { Account } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private readonly accountRepository: AccountsRepository) {}
  async createAccount(data: CreateAccountDto): Promise<Account> {
    return this.accountRepository.createAccount(data);
  }

  async findAllAccount(userId: number): Promise<Account[]> {
    return this.accountRepository.findAllAccount(userId, { is_delete: false });
  }

  async findAccountById(id: number): Promise<Account> {
    return await this.accountRepository.findAccountById(id, {
      is_delete: false,
    });
  }

  async findAccountByAccNumber(accountNumber: string): Promise<Account> {
    return this.accountRepository.findAccountByAccNumber(accountNumber);
  }

  async updateAccount(id: number, data: UpdateAccountDto): Promise<Account> {
    return this.accountRepository.updateAccount(id, data);
  }

  async softDeleteAccount(id: number): Promise<Account> {
    return this.accountRepository.softDeleteAccount(id);
  }

  async restoreAccount(id: number): Promise<Account> {
    return this.accountRepository.restoreAccount(id);
  }

  async hardDeleteUser() {
    const result = await this.accountRepository.hardDeleteUser();

    if (result.count === 0) {
      throw new NotFoundException('No soft-deleted accounts found');
    }

    return {
      message: `${result.count} accounts permanently deleted`,
    };
  }
}
