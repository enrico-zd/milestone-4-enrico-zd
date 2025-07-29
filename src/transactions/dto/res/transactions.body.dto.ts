import { TransactionType } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { AccountResponseDto } from 'src/accounts/dto/res/account.body.dto';
import { UserResponseDTO } from 'src/users/dto/res/user.body.dto';

export class transactionResponseDto {
  @Expose()
  id: number;

  @Expose()
  type: TransactionType;

  @Expose()
  @Type(() => Number)
  amount: number;

  @Expose()
  description?: number;

  @Expose()
  @Type(() => AccountResponseDto)
  source_account: AccountResponseDto;

  @Expose()
  @Type(() => AccountResponseDto)
  destination_account: AccountResponseDto;

  @Expose()
  @Type(() => UserResponseDTO)
  performed_by_user: UserResponseDTO;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
