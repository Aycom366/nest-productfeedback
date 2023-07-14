import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from 'src/dto/auth.dto';

@Controller('auth')
export class AuthController {
  @Post()
  async signUp(@Body() body: SignUpDto) {
    return '';
  }
}
