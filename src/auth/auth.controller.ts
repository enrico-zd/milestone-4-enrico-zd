import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDTO } from './dto/req/auth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { SerializationInterceptor } from 'src/common/interceptors/serialization.interceptors';

@UseInterceptors(SerializationInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  register(@Body() data: RegisterDTO) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}
