import { Controller, Get } from '@nestjs/common';
import { SkipAuth } from './decorators/skipAuth.decorators';

@Controller()
export class AppController {
  @SkipAuth()
  @Get()
  getRootEndpoint() {
    return '<h1>Hello, World!</h1><a href="/api">Go to API</a>';
  }
}
