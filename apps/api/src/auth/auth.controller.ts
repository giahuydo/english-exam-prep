import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '@app/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  @Post('register')
  register(@Body(new ZodValidationPipe(RegisterDto)) dto: RegisterDto) {
    return this.svc.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body(new ZodValidationPipe(LoginDto)) dto: LoginDto) {
    return this.svc.login(dto);
  }
}
