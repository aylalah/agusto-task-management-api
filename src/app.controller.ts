import { Controller, Get } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AppService } from './app.service';
import { success } from './utils/response.util';

@Controller('/')
export class AppController {

  constructor(
    private readonly appService: AppService,
    private readonly i18n: I18nService,
  ) { }

  // @Get('/')
  // async index() {
  //   return success(
  //     this.appService.getHello(),
  //     await this.i18n.translate('responses.APP_NAME', {
  //       lang: 'en',
  //     }),
  //     await this.i18n.translate('responses.APP_DESC', {
  //       lang: 'en',
  //     }),
  //   );
  // }

}
