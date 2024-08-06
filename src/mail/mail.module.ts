import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import * as path from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';;
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      defaults: {
        from: '"No Reply" <admin.checkschool@gmail.com>',
      },
      template: {
        dir: path.join(process.env.PWD, 'templates/welcome'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: path.join(process.env.PWD, 'templates/welcome'),
          options: {
            strict: true,
          },
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
