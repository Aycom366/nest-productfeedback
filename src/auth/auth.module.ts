import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailingService } from 'src/mailing/mailing.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    /**
     * This is to register the jwtmodule globally on the auth module
     * useFactory to get Nest configService in the jwtModule
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, MailingService],
  controllers: [AuthController],
})
export class AuthModule {}
