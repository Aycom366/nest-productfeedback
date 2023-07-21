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
  SignUpResponseDto,
  UserResponse,
  VerifyEmailDto,
} from 'src/dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { SkipAuth } from 'src/decorators/skipAuth.decorators';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

const customSchemaReturn = (message?: string, statusCode?: number) => {
  return { message: message ?? 'Unauthorized', statusCode: statusCode ?? 401 };
};

const messageData = (message?: string) => {
  return { message: message ?? 'OK' };
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('/signup')
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already taken or userName already taken',
    schema: {
      example: {
        message: 'Email already taken',
        statusCode: 409,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signup success',
    type: SignUpResponseDto,
  })
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @HttpCode(200)
  @SkipAuth()
  @Post('/verify-email-code')
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Email not found',
    schema: {
      example: {
        message: 'Email not found',
        error: 'Not found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token not correct',
    schema: {
      example: {
        message: 'Invalid Token',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    schema: {
      example: { message: 'Email verified' },
    },
  })
  async verifyEmailCode(@Body() body: VerifyEmailDto) {
    return this.authService.verifyEmailCode(body);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(AuthGuard)
  @Get('/me')
  @ApiResponse({
    status: 200,
    description: "Gets logged in user's details",
    type: UserResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthroized',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  async me(@Request() req) {
    return new UserResponse(req.user);
  }

  @HttpCode(200)
  @SkipAuth()
  @Post('/signin')
  @ApiResponse({
    status: 200,
    description: 'Signin success',
    schema: {
      example: {
        token: '',
        email: 'johnDoe@gmail.com',
        id: 1,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Credentials',
    schema: {
      example: customSchemaReturn('Invalid Credentials', 400),
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'UNPROCESSABLE_ENTITY',
    schema: {
      example: customSchemaReturn('Please Verify your email!', 422),
    },
  })
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @HttpCode(200)
  @SkipAuth()
  @Post('/reset-password')
  @ApiResponse({
    status: 400,
    description: 'Token has Expired',
    schema: {
      example: customSchemaReturn('Token has expired', 400),
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Reset Successful',
    schema: {
      example: messageData('Password reset successful'),
    },
  })
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  @HttpCode(HttpStatus.OK)
  @SkipAuth()
  @Post('/logout')
  @ApiResponse({
    status: 200,
    description: 'Reset Successful',
    schema: {
      example: messageData('Logout success'),
    },
  })
  async logout(@Body() body: LogoutDto) {
    return this.authService.logout(body);
  }

  @HttpCode(200)
  @SkipAuth()
  @Post('/forgot-password')
  @ApiResponse({
    status: 200,
    description: 'Reset Successful',
    schema: {
      example: messageData(
        "Please check your email for password reset token,It's going to expire in the next 10 minutes",
      ),
    },
  })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }
}
