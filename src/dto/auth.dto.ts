import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserResponse {
  id: number;
  email: string;
  userName: string;
  name: string;

  @Exclude()
  password: string;

  avatarUrl: string;
  created_at: Date;
  updated_at: Date;

  @Exclude()
  verified: boolean;

  @Exclude()
  verificationToken: string | null;

  @Exclude()
  passwordToken: null | string;

  @Exclude()
  passwordTokenExpirationDate: null | string;

  @Exclude()
  loginToken: string;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyEmailDto {
  @IsEmail()
  email: string;

  @IsNumber()
  @IsPositive()
  verificationToken: number;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class LogoutDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsInt()
  @IsPositive()
  passwordToken: number;
}
