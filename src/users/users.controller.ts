import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/req/create-user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SerializationInterceptor } from 'src/common/interceptors/serialization.interceptors';

@UseInterceptors(SerializationInterceptor)
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.findUserById(user.id);
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
