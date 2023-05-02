import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';



export class AppController {
  constructor(private readonly appService: AppService) {}
 
}
