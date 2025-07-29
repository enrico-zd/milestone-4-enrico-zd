import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/req/create-account.dto';
import { UpdateAccountDto } from './dto/req/update-account.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { SerializationInterceptor } from 'src/common/interceptors/serialization.interceptors';

@UseInterceptors(SerializationInterceptor)
@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async createAccount(@Body() data: CreateAccountDto) {
    return this.accountsService.createAccount(data);
  }

  @Get()
  async findAllAccount(@CurrentUser() user: User) {
    return this.accountsService.findAllAccount(user.id);
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
