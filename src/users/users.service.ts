import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { UserRepository } from './users.repository';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/req/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDto) {
    return this.userRepository.createUser(data);
  }

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findUserById(id, {
      is_delete: false,
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findUserByEmail(email, {
      is_delete: false,
    });

    return user;
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    return this.userRepository.updateUser(id, data);
  }

  async softDeleteUser(id: number): Promise<User> {
    return this.userRepository.softDeleteUser(id);
  }

  async restoreUser(id: number): Promise<User> {
    return this.userRepository.restoreUser(id);
  }

  async hardDeleteUser(id: number): Promise<User> {
    return this.userRepository.hardDeleteUser(id);
  }
}
