import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailingService } from './mailing.service';

@Module({
  providers: [MailingService, ConfigService],
  exports: [MailingService],
})
export class MailingModule {}
