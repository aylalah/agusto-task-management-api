import { plainToClass } from 'class-transformer';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Length, validateSync } from 'class-validator';

class EnvironmentVariables {

  @IsString()
  BASE_PATH: string

  @IsString()
  SERVICE_NAME: string

  @IsString()
  SERVICE_URL: string

  @IsNumber()
  PORT: number
  
  @IsIn([
    'development',
    'staging',
    'simulate',
    'production',
  ])
  NODE_ENV: string

  @IsString()
  DB_DIALECT: string

  @IsString()
  DB_NAME: string

  @IsBoolean()
  DB_SYNC: boolean

  @IsBoolean()
  DB_LOG: boolean

  @IsNumber()
  THROTTLE_TTL: number

  @IsNumber()
  THROTTLE_LIMIT: number

  @IsNumber()
  HTTP_TIMEOUT: number

  @IsNumber()
  HTTP_MAX_REDIRECTS: number

  @IsString()
  JWT_SECRET: string

  @IsNumber()
  JWT_EXPIRY: number

  @IsString()
  REDIS_HOST: string

  @IsNumber()
  REDIS_PORT: number

  @IsString()
  REDIS_PASS: string

  @IsNumber()
  REDIS_DB: number

  @IsOptional()
  @IsIn([
    'on',
    'off',
  ])
  
  @IsOptional()
  @IsIn([
    'on',
    'off',
  ])
  SHUTDOWN_SWITCH?: string
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
