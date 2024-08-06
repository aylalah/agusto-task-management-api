import {
  Body,
  Controller,
  forwardRef,
  Get,
  Param,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './local-strategy/local.guard';
import { JwtGuard } from './jwt-strategy/jwt.guard';
import {
  success,
  Event,
  error,
} from '../../utils';
import { EventEmitter2 } from 'eventemitter2';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, UserService } from '../user';
import { RegisterUserDto } from './dto/create-user.dto';
import { LoginUserDto, RefreshTokenDto } from './dto/update-user.dto';
import { GetUser } from '../../decorators';
import * as moment from "moment";
// import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../mail/mail.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

@ApiTags('Authentication Managements')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
    // private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Body() user: LoginUserDto, @GetUser() authUser: User) {
    this.eventEmitter.emit(Event.USER_BEFORE_LOGIN, { user });
    const token = await this.authService.login(authUser);

    if (authUser?.status == false) {
      throw new UnauthorizedException('Your account have not been activated by the admin');
    }

    if (authUser?.verify_email == false) {
      throw new UnauthorizedException('Your email have not been confirm');
    }

    else{
        return success(
          {
            token: token.token,
            id: authUser.id,
            email:authUser.email,
            password: null,
          },
          'Sign In',
          'Sign in was successful',
        );
    }

  }

  @Get('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async user(@GetUser() authUser: User) {
    const user = await this.userService.findOne(authUser.id);
    return success(
      {
        ...user,
        password: null
      },
      'User Profile',
      'User profile details',
    );
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async logout(@GetUser() authUser: User) {
    const token = await this.authService.logout(authUser);
    let profile;
    return success(
      {

      },
      'Sign Out',
      'Signing Out was successful',
    );
    

  }

  @Get('confirm_email/:token')
  @ApiBearerAuth()
  async confirmEmail(@Param('token') token: string) {

    const timeStamp = moment(new Date().getTime()).format("MM/DD/YYYY hh:mm a");

    const existingUser = await this.userService.userRepository.findOne({
      // select: ['id', 'phone_number', 'email', 'role_id', 'email_token_timestamp'],
      where: [{ token: token }],
    }) ?? null;

    if (existingUser) {

      if (existingUser.verify_email) {
        return error(
          'Email Confirmed',
          'You have a verified email already. You cannot confirm email.',
        );
      }

      await this.userService.update(existingUser.id, {
        verify_email: true,
        token: '',
        updated_at: timeStamp,
      });
  
      this.eventEmitter.emit(Event.NEVER_BOUNCE_VERIFY, { user: { ...existingUser, email_valid: true } });

        return success(
          {
            email: existingUser.email
          },
          'Congratulation',
          'Email Confirmed successfully',
        );

    } else{

      return error('Fail', 'invalid confirmation');

    }

  }

  @Post('refresh-token')
  async refresh(@Body() refreshToken: RefreshTokenDto) {

    const oldToken = refreshToken.token

    const payload = this.jwtService.decode(oldToken)
    const id = payload?.sub;
    if (!id) {
      return error('Token Refresh', 'You need to login again :)');
    }

    const user = await this.userService.findOne(id);
    if (!user) {
      return error('Token Refresh', 'You need to login again :)');
    }

    const authUser = await this.authService.login(user);
    
    return success(
      {
        ...authUser,
      },
      'Token Refresh',
      'Token refresh was successful',
    );
  }

}
