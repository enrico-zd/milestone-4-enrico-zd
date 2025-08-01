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
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/req/create-account.dto';
import { UpdateAccountDto } from './dto/req/update-account.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { SerializationInterceptor } from '../common/interceptors/serialization.interceptors';
import { RepositoryException } from '../common/exceptions/exception.repository';

@UseInterceptors(SerializationInterceptor)
@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async createAccount(@Body() data: CreateAccountDto) {
    try {
      const account = await this.accountsService.createAccount(data);
      return account;
    } catch (error) {
      if (error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get()
  async findAllAccount(@CurrentUser() user: User) {
    try {
      const account = await this.accountsService.findAllAccount(user.id);
      return account;
    } catch (error) {
      if (error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get(':id')
  async findAccountById(@Param('id', ParseIntPipe) id: number) {
    try {
      const account = await this.accountsService.findAccountById(id);
      return account;
    } catch (error) {
      if (error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Patch(':id')
  async updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAccountDto,
  ) {
    try {
      const account = await this.accountsService.updateAccount(id, data);
      return account;
    } catch (error) {
      if (error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Patch(':id/soft-delete')
  async softDeleteAccount(@Param('id', ParseIntPipe) id: number) {
    try {
      const account = await this.accountsService.softDeleteAccount(id);
      return account;
    } catch (error) {
      if (error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Patch(':id/restore')
  async restoreAccount(@Param('id', ParseIntPipe) id: number) {
    try {
      const account = await this.accountsService.restoreAccount(id);
      return account;
    } catch (error) {
      if (error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Delete()
  async hardDeleteUser() {
    try {
      const account = await this.accountsService.hardDeleteUser();
      return account;
    } catch (error) {
      if (error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
