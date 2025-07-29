import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either CUSTOMER or ADMIN' })
  role?: Role;

  @IsOptional()
  @IsDate()
  last_login?: Date;

  @IsOptional()
  @IsString()
  refresh_token?: string;
}
