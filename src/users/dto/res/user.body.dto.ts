import { Role } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDTO {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  full_name: string;

  @Expose()
  role: Role;

  @Expose()
  last_login: Date;
}
