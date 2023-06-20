/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable({})
export class AppService {
  constructor(@Inject('MQ_CLIENT') private client: ClientProxy) {}
}
