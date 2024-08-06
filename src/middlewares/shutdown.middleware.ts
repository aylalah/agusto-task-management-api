import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { response } from '../utils';

@Injectable()
export class ShutdownMiddleware implements NestMiddleware {

  headers = {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    'access-control-allow-headers': '*',
  }

  use(req: any, res: any, next: () => void) {
    return this.serverResponse(
      res, 
      HttpStatus.BAD_REQUEST, 
      'error', 
      'Service Information', 
      'This service is temporary down. We would be back soon',
    )
  }

  private serverResponse(res: any, httpStatus: number, status: string, title: string, message?: string, data?: any, meta?: any) {
    res?.writeHead(httpStatus, this.headers);
    res?.write(
      JSON.stringify(response(status as any, title, message, null, data, meta)),
    );
    res?.end();
  }

}
