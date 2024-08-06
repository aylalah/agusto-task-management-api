import { Controller, Post, Query } from "@nestjs/common";
import { MailService } from "./mail.service";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Post('send')
    async sendEmail(@Query('email') email, @Query('name') name) {

        email = 'ayoadelala@yahoo.com';
        name = 'Ayolala';

        console.log('email', email);

        const res = await this.mailService.sendMail(email, name);

        return res.response;
    }
}