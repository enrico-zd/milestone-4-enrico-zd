import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async createAccount(@Body() data: CreateAccountDto) {
    return this.accountsService.createAccount(data);
  }

  @Get()
  async findAllAccount() {
    return this.accountsService.findAllAccount();
  }

  @Get(':id')
  async findAccountById(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findAccountById(id);
  }

  @Patch(':id')
  async updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAccountDto,
  ) {
    return this.accountsService.updateAccount(id, data);
  }

  @Patch(':id/soft-delete')
  async softDeleteAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.softDeleteAccount(id);
  }

  @Patch(':id/restore')
  async restoreAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.restoreAccount(id);
  }

  @Delete()
  async hardDeleteUser() {
    return this.accountsService.hardDeleteUser();
  }
}
