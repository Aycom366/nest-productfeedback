import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bycryptjs from 'bcryptjs';
import { MailingService } from 'src/mailing/mailing.service';
import { JwtService } from '@nestjs/jwt';

interface AuthParams {
  name: string;
  userName: string;
  email: string;
  password: string;
  verificationToken: number;
  passwordToken: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailingService: MailingService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn({ email, password }: Pick<AuthParams, 'email' | 'password'>) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('Invalid Credentials');

    const doesPasswordMatch = await bycryptjs.compare(password, user.password);
    if (!doesPasswordMatch)
      throw new BadRequestException('Invalid Credentials');

    if (!user.verified)
      throw new UnprocessableEntityException('Please Verify your email!');

    const payload = {
      email: user.email,
      id: user.id,
    };

    const token = await this.jwtService.signAsync(payload);

    await this.prismaService.user.update({
      where: { email },
      data: {
        loginToken: token,
      },
    });

    return { token, ...payload };
  }

  async signUp(body: Omit<AuthParams, 'verificationToken' | 'passwordToken'>) {
    const doesEmailExit = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });
    if (doesEmailExit) throw new ConflictException('Email alrady taken');

    const doesUserNameExist = await this.prismaService.user.findUnique({
      where: { userName: body.userName },
    });
    if (doesUserNameExist) throw new ConflictException('Email alrady taken');

    const emailVerificationToken = Math.floor(Math.random() * 899999 + 100000);

    const hashedPassword = await bycryptjs.hash(body.password, 10);

    await this.prismaService.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
        userName: body.userName,
        verificationToken: emailVerificationToken,
      },
    });

    this.mailingService.sendMail(
      body.email,
      emailVerificationToken,
      'Email Verification Link',
      'verifyEmail',
    );

    return { message: 'Please check your email for a verification code' };
  }

  async verifyEmailCode(body: Pick<AuthParams, 'email' | 'verificationToken'>) {
    const doesEmailExist = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });
    if (!doesEmailExist) throw new NotFoundException('Email not found');

    if (doesEmailExist.verificationToken != body.verificationToken)
      throw new BadRequestException('Invalid Token');

    await this.prismaService.user.update({
      where: { email: body.email },
      data: {
        verificationToken: null,
        verified: true,
      },
    });

    return { message: 'Email verified' };
  }

  async logout({ email }: Pick<AuthParams, 'email'>) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) {
      await this.prismaService.user.update({
        where: { email },
        data: { loginToken: null },
      });
    }
    return { message: 'Logout success' };
  }

  async forgotPassword({ email }: Pick<AuthParams, 'email'>) {
    const doesEmailExist = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (doesEmailExist) {
      const passwordToken = Math.floor(Math.random() * 899999 + 100000);
      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

      this.mailingService.sendMail(
        email,
        passwordToken,
        'Password Reset Token',
        'forgotPassword',
      );

      await this.prismaService.user.update({
        where: { email },
        data: {
          passwordToken,
          passwordTokenExpirationDate,
        },
      });
    }

    return {
      message:
        "Please check your email for password reset token,It's going to expire in the next 10 minutes",
    };
  }

  async resetPassword({
    password,
    email,
    passwordToken,
  }: Pick<AuthParams, 'password' | 'email' | 'passwordToken'>) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user) {
      if (user.passwordTokenExpirationDate < new Date())
        throw new BadRequestException('Token has expired');

      if (passwordToken == user.passwordToken) {
        const hashedPassword = await bycryptjs.hash(password, 10);
        await this.prismaService.user.update({
          where: { email },
          data: {
            password: hashedPassword,
            passwordTokenExpirationDate: null,
            passwordToken: null,
          },
        });
      }
    }
    return {
      message: 'Password reset successful',
    };
  }
}
