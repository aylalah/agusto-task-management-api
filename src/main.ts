import "./tracer"
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyHelmet from 'fastify-helmet';
import { AppModule } from './app.module';
import compression from 'fastify-compress';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import multipart from 'fastify-multipart';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { ConfigService } from '@nestjs/config';

// const express = require('express');

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.0,
  maxBreadcrumbs: 50,
  debug: true,
  sampleRate: 1.0,
  attachStacktrace: true,
});

async function bootstrap() {
  // const app2 = express();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: process.env.NODE_ENV === 'production' ? ['error'] : ['log', 'error', 'warn', 'debug', 'verbose']
    }
  );
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [
          `'self'`,
          `'unsafe-inline'`,
          'cdn.jsdelivr.net',
          'fonts.googleapis.com',
        ],
        fontSrc: [`'self'`, 'fonts.gstatic.com'],
        imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `cdn.jsdelivr.net`],
      },
    },
  });
  app.register(compression, { encodings: ['gzip', 'deflate'] });
  app.register(multipart, {
    throwFileSizeLimit: true,
    limits: {
      // fieldNameSize: 100, // Max field name size in bytes
      // fieldSize: 1000000, // Max field value size in bytes
      // fields: 10, // Max number of non-file fields
      fileSize: 25 * 1000 * 1000, // For multipart forms, the max file size
      // files: 1, // Max number of file fields
      // headerPairs: 2000, // Max number of header key=>value pairs
    },
  });
    app.setGlobalPrefix('/api/v1');
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
      .setTitle('Agusto Assessment API')
      .setDescription('Task Managemets')
        .setVersion('1.0')
        .setBasePath(process.env.BASE_PATH)
        .addBearerAuth()
        .build(),
      {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
          methodKey,
      },
    );
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: { 
        persistAuthorization: true,
      },
      customSiteTitle: 'CRUD',
    });
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT', 3005), '0.0.0.0');
}
bootstrap();

