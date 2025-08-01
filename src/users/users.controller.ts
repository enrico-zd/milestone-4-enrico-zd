import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SerializationInterceptor } from '../common/interceptors/serialization.interceptors';
import { RepositoryException } from '../common/exceptions/exception.repository';

@UseInterceptors(SerializationInterceptor)
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    try {
      const users = await this.usersService.findUserById(user.id);
      return users;
    } catch (error) {
      if (error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    try {
      const user = await this.usersService.updateUser(id, data);
      return user;
    } catch (error) {
      if (error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Patch(':id/soft-delete')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.softDeleteUser(id);
      return user;
    } catch (error) {
      if (error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Patch(':id/restore')
  async restoreUser(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.restoreUser(id);
      return user;
    } catch (error) {
      if (error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Delete(':id')
  async hardDeleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.hardDeleteUser(id);
      return user;
    } catch (error) {
      if (error instanceof RepositoryException) throw error;
      throw new InternalServerErrorException({
        message: 'something wrong on our side',
        error: 'internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
