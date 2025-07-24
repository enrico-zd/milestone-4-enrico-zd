import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/req/create-user.dto';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Get(':id')
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, data);
  }

  @Patch(':id/soft-delete')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.softDeleteUser(id);
  }

  @Patch(':id/restore')
  async restoreUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.restoreUser(id);
  }

  @Delete(':id')
  async hardDeleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.hardDeleteUser(id);
  }
}
