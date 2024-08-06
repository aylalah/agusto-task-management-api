import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { Event, Message, prettify, response, ucfirst } from '../utils';
import { IncomingMessage, ServerResponse } from 'http';

@Catch()
export class ErrorFilter<T> implements ExceptionFilter {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest() as IncomingMessage;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.eventEmitter.emit(Event.LOG_ERROR, {
      error: {
        exception,
        status,
        serviceName: this.configService.get<string>('SERVICE_NAME'),
        serviceBaseUrl: this.configService.get<string>('SERVICE_URL'),
        serviceSlugs: req.url,
      },
    });

    let title = 'Something went wrong';
    let message: string;
    let data: any;
    let exceptionResource: any;
    switch (status) {
      case 400:
        exceptionResource = (
          exception as BadRequestException
        ).getResponse() as any;
        title = exceptionResource?.title ? exceptionResource.title : 'Request Validation';
        message =
          typeof exceptionResource?.message === 'string'
            ? `${exceptionResource.message}. Check your input and try again.`
            : `${ucfirst(
                prettify(exceptionResource.message[0] ?? ''),
              )}. Check your input and try again.`;
        data = exceptionResource?.data ? exceptionResource.data : exceptionResource?.message;

        // let message = exception.getResponse() as {
        //   key: string;
        //   args: Record<string, any>;
        // };

        // message = await this.i18n.translate(message.key, {
        //   lang: ctx.getRequest().i18nLang,
        //   args: message.args,
        // });

        break;
      case 401:
        message = (exception as UnauthorizedException).message;
        break;
      case 403:
        message = Message.FORBIDDEN;
        break;
      case 404:
        title = 'Not found'
        message = 'Check the request and try again.';
        break;
      case 429:
        title = 'Too many requests'
        message = (exception as any)?.message ?? "You've had your fair share of requests. Try again in a minute.";
        break;
      case 413:
        title = 'Request too large'
        message = "You tried uploading a file or data that's larger than what we expect"
      case 500:
      default:
        message = (exception as any)?.message ?? Message.FINAL_ERROR;
        break;
    }

    // exception instanceof BadRequestException ?
    //   res.status(status).send(error('Something went wrong', exception.message, status))
    //   : res.status(status).send(error('Something went wrong', Message.FINAL_ERROR, status))

    if (res instanceof ServerResponse) {
      res.writeHead(status);
      res.write(JSON.stringify(response('error', title, message)));
      res.end();
    } else {
      res.status(status).send(response('error', title, message));
    }
  }
}
