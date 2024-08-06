import { forwardRef, Module } from '@nestjs/common';
import { JwtStrategyService } from './jwt-strategy/jwt.service';
import { LocalStrategyService } from './local-strategy/local.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user';
import { MailService } from '../../mail/mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from '../../services';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: `${configService.get('JWT_EXPIRY')}s` },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    ServicesModule,
  ],
  providers: [AuthService, LocalStrategyService, JwtStrategyService, MailService],
  exports: [AuthService,  JwtModule],
  controllers: [
    AuthController,
  ],
})
export class AuthModule {}
