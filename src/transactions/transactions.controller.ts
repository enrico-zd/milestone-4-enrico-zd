import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateTransactionDto } from './dto/req/create-transaction.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SerializationInterceptor } from '../common/interceptors/serialization.interceptors';

@UseInterceptors(SerializationInterceptor)
@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Roles('ADMIN')
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findById(id);
  }

  @Roles('ADMIN')
  @Get('account/:id')
  async findAllByAccountId(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findAllByAccountId(id);
  }

  @Get()
  async findAllByUserId(@CurrentUser() user: User) {
    return this.transactionsService.findAllByUserId(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTransaction(
    @CurrentUser() user: User,
    @Body() data: CreateTransactionDto,
  ) {
    return this.transactionsService.createTransaction(data, user.id);
  }
}
