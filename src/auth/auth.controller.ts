import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ForgotPasswordDto,
  LogoutDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  VerifyEmailDto,
} from 'src/dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @HttpCode(200)
  @Post('/verify-email-code')
  async verifyEmailCode(@Body() body: VerifyEmailDto) {
    return this.authService.verifyEmailCode(body);
  }

  @HttpCode(200)
  @Post('/signin')
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @HttpCode(200)
  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(@Body() body: LogoutDto) {
    return this.authService.logout(body);
  }

  @HttpCode(200)
  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }
}
