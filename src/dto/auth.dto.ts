import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class SignUpResponseDto {
  @ApiProperty({
    description: 'Signup Response',
    example: 'Please check your email for a verification code',
  })
  message: string;
}

export class SignUpDto {
  @ApiProperty({
    description: 'Name of user',
    name: 'name',
    example: 'john doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'userName that will be used for the user after authentication',
    name: 'userName',
    example: 'johndoe24',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: "User's email",
    name: 'email',
    example: 'johndoe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password",
    name: 'password',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  name: string;

  @Exclude()
  password: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
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
  @ApiProperty({
    description: "User's email",
    name: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password",
    name: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyEmailDto {
  @ApiProperty({
    description: "User's email",
    name: 'email',
    example: 'johndoe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's Email Verification Token",
    name: 'verificationToken',
    example: 123456,
  })
  @IsNumber()
  @IsPositive()
  verificationToken: number;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: "User's email",
    name: 'email',
    example: 'johndoe@gmail.com',
  })
  @IsEmail()
  email: string;
}

export class LogoutDto {
  @ApiProperty({
    description: "User's email",
    name: 'email',
    example: 'johndoe@gmail.com',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: "User's email",
    name: 'email',
    example: 'johndoe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password",
    name: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "User's Email Password Token",
    name: 'verificationToken',
    example: 123456,
  })
  @IsInt()
  @IsPositive()
  passwordToken: number;
}
