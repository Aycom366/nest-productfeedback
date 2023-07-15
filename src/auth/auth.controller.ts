import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ForgotPasswordDto,
  LogoutDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  UserResponse,
  VerifyEmailDto,
} from 'src/dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { SkipAuth } from 'src/decorators/skipAuth.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post()
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @HttpCode(200)
  @SkipAuth()
  @Post('/verify-email-code')
  async verifyEmailCode(@Body() body: VerifyEmailDto) {
    return this.authService.verifyEmailCode(body);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async me(@Request() req) {
    return new UserResponse(req.user);
  }

  @HttpCode(200)
  @SkipAuth()
  @Post('/signin')
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @HttpCode(200)
  @SkipAuth()
  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  @HttpCode(HttpStatus.OK)
  @SkipAuth()
  @Post('/logout')
  async logout(@Body() body: LogoutDto) {
    return this.authService.logout(body);
  }

  @HttpCode(200)
  @SkipAuth()
  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }
}
