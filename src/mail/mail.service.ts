import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as moment from "moment";

const fs = require("fs");
const path = require("path");
const downloadPath = path.resolve('./download');
const handlebars = require("handlebars");
const today: any = moment().format("YYYY-MM-DD_HH:mm:ss");
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import * as nodemailerExpressHandlebars from 'nodemailer-express-handlebars';

const mailjet = require ('node-mailjet')
.connect('5e4c6a900c8fa6b436bd02b4dc312928', 'e06961412e2d2df60d998768e12acf9b')
// .connect('04212573e56b5bc3ce53a2ea7d7c42df', '99855f2749fa31264885819364aae031')


@Injectable()
export class MailService {

  appUrl = this.configService.get('APP_URL');
  webUrl = this.configService.get('WEB_URL');
  emailSender = this.configService.get('EMAIL_EMAIL');
  googleEmailUser = this.configService.get('GOOGLE_EMAIL_USER');
  googleEmailPassword = this.configService.get('GOOGLE_EMAIL_PASSWORD');


  googleEmailServiceAuth = {
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.googleEmailUser,
        pass: this.googleEmailPassword,
      },
      tls: {
        rejectUnauthorized: false
    }
  };
  transporter = nodemailer.createTransport(this.googleEmailServiceAuth);

  constructor(
      private readonly mailerService: MailerService,
      private readonly configService: ConfigService,
  ) {

    this.transporter.use(
      'compile',
      nodemailerExpressHandlebars({
        viewEngine: {
        //   extName: '.hbs',
          partialsDir: path.join(process.cwd(), 'template'),
          layoutsDir: path.join(process.cwd(), 'template'),
          defaultLayout: '',
        },
        viewPath: path.join(process.cwd(), 'template'),
        extName: '.hbs',
      }),
    );

  }

  async sendMail(email: string, name: string) {
      console.log(email);

      const mailRes = await this.mailerService
      .sendMail({
          to: `${name} <${email}>`, // list of receivers
          from: `"Konnect Admin" <${this.emailSender}>`, // sender address
          cc: [
                {
                    address: "ayoadelala@yahoo.com",
                    name: "Engineering"
                },
                {
                    address: "o.olusegun@consukon.com",
                    name: "Olusegun Olumide"
                }
            ],
        //   bcc: [''],
          subject: `Welcome to Konnect. Enjoy A Life Transforming Experience`, // Subject line
          template: path.join(process.cwd(), `templates/mobileappactivate`),
          context: {
              // "confirmation_link": `${this.webUrl}/auth/email_confirmation/6666778877`,
              "email": "ayoadelala@yahoo.com",
              "firstName": `${name}`,
              "recoveryCode": "1223456",
          }
      })
      .then((response) => { console.log('response', response); return response})
      .catch((err) => { console.log('err', err) });

      return mailRes

      console.log('mailRes', mailRes);
  }

  async welcomeUser(data) {
    console.log(data);

    const emailData = {
      from: `"Agusto" <${this.emailSender}>`,
      to: `"${data.fullname}" <${data.email}>`,
      // cc: [
      //   {
      //     address: 'ayoadelala@yahoo.com',
      //     name: 'Host',
      //   },

      // ],
      bcc: [
        {
          address: 'ayoadelala@yahoo.com',
          name: 'Admin',
        }
      ],
      subject: `Welcome To Agusto`,
      // attachments: [
      //   {
      //     filename: '001.jpg',
      //     content: fs.readFileSync('src/assets/images/001.jpg'),
      //     cid: 'image1_cid',
      //   },
      // ],
      template: 'welcome',
      context: {
        confirm_url: `${this.appUrl}/auth/confirmation?type=email_token&value=${data.email_token}`,
        subject: "Welcome To Agusto",
        fullname: data.fullname,
        email: data.email,
        firstname: data.first_name,
        password: data.password,
        role: data.role,
      },
    };

    this.transporter
      .sendMail(emailData)
      .then((info) => {
        console.log('Email sent:', info);
        return info;
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });

  }

}
