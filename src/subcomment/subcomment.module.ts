import { Module } from '@nestjs/common';
import { SubcommentController } from './subcomment.controller';
import { SubcommentService } from './subcomment.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guards/auth.guards';

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
  controllers: [SubcommentController],
  providers: [
    SubcommentService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class SubcommentModule {}
