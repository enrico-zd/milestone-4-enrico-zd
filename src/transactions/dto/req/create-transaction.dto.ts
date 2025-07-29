import { TransactionType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsNotEmpty()
  @IsEnum(TransactionType, {
    message: 'Transaction mush be eather DEPOSIT, WITHDRAW, or TRANSFER',
  })
  type: TransactionType;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  destinationAccountNumber?: string;
}
