import { AccountType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class findAccount {
  @IsString()
  account_number: string;
}
export class CreateAccountDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, {
    message: 'account_number must contain only numbers',
  })
  account_number: string;

  @IsNotEmpty()
  @IsEnum(AccountType, {
    message: 'Account mush be eather SAVING, CHECKING, BUSINESS or INVESTMENT',
  })
  account_type: AccountType;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  balance: number;
}
