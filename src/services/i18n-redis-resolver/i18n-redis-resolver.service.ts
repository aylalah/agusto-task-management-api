import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';
import { IoRedisService } from '../../io-redis';
import { outject } from '../../utils';

@Injectable()
export class I18nRedisResolverService implements I18nResolver {
  async resolve(context: ExecutionContext): Promise<string> {
    // const ioRedisService = outject(IoRedisService) as IoRedisService
    // const lang = await ioRedisService.get('kabani:user:lang')
    // console.log({ lang })
    // return lang ?? 'en';
    return 'en';
  }
}
