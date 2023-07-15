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
