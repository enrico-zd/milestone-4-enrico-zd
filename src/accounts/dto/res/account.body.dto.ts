import { Expose, Type } from 'class-transformer';

export class AccountResponseDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  account_number: string;

  @Expose()
  account_type: string;

  @Expose()
  @Type(() => Number)
  balance: number;

  @Expose()
  create_at: Date;

  @Expose()
  updated_at: Date;
}
