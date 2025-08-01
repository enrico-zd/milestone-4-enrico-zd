import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { AccountType } from '@prisma/client';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsOptional()
  @IsEnum(AccountType, {
    message: 'Account mush be eather SAVING, CHECKING, BUSINESS or INVESTMENT',
  })
  account_type: AccountType;

  @IsOptional()
  is_active?: boolean;
}
