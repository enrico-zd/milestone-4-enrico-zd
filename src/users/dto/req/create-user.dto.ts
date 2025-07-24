import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsEnum(Role, { message: 'Role must be either CUSTOMER or ADMIN' })
  role: Role;
}

export class createUserWithAccountDTO extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  account_number: string;

  @IsNotEmpty()
  @IsString()
  account_type: string;
}
