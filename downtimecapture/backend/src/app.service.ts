import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return JSON.parse('{"hi": "Hello World from the NestJS Backend"}');
  }
  
}