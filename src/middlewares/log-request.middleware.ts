import { Injectable, NestMiddleware } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IncomingMessage, ServerResponse } from 'http';
import { Event } from '../utils';

@Injectable()
export class LogRequestMiddleware implements NestMiddleware {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  use(req: IncomingMessage, res: ServerResponse, next: () => void) {
    this.eventEmitter.emit(Event.LOG_REQUEST, { request: req });
    next();
  }
}
