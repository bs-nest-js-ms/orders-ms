import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  DEFAULT_LIMIT: number;
  DEFAULT_SKIP: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string
  POSTGRES_DB: string;
  POSTGRES_PORT: number;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    DEFAULT_LIMIT: joi.number().required(),
    DEFAULT_SKIP: joi.number().required(),
    POSTGRES_USER: joi.string().required(),
    POSTGRES_PASSWORD: joi.string().required(),
    POSTGRES_DB: joi.string().required(),
    POSTGRES_PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) throw new Error(`Environments Config Validation error: ${error}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  database: envVars.DATABASE_URL,
  default_limit: envVars.DEFAULT_LIMIT,
  default_skip: envVars.DEFAULT_SKIP,
  postgres_user: envVars.POSTGRES_USER,
  postgres_password: envVars.POSTGRES_PASSWORD,
  postgres_db: envVars.POSTGRES_DB,
  postgres_port: envVars.POSTGRES_PORT,
};
