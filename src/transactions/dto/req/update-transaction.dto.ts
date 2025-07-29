import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsNotEmpty()
  @IsEnum(TransactionType, {
    message: 'Transaction mush be eather DEPOSIT, WITHDRAW, or TRANSFER',
  })
  type: TransactionType;
}
