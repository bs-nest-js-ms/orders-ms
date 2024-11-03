import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DEFAULT_LIMIT: number;
  DEFAULT_SKIP: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string
  POSTGRES_DB: string;
  POSTGRES_PORT: number;
  // PRODUCTS_MICROSERVICE_HOST: string;
  // PRODUCTS_MICROSERVICE_PORT: number;
  NATS_SERVERS: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DEFAULT_LIMIT: joi.number().required(),
    DEFAULT_SKIP: joi.number().required(),
    POSTGRES_USER: joi.string().required(),
    POSTGRES_PASSWORD: joi.string().required(),
    POSTGRES_DB: joi.string().required(),
    POSTGRES_PORT: joi.number().required(),
    // PRODUCTS_MICROSERVICE_HOST: joi.string(),
    // PRODUCTS_MICROSERVICE_PORT: joi.number(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});

if (error) throw new Error(`Environments Config Validation error: ${error}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  default_limit: envVars.DEFAULT_LIMIT,
  default_skip: envVars.DEFAULT_SKIP,
  postgres_user: envVars.POSTGRES_USER,
  postgres_password: envVars.POSTGRES_PASSWORD,
  postgres_db: envVars.POSTGRES_DB,
  postgres_port: envVars.POSTGRES_PORT,
  // products_microservice_host: envVars.PRODUCTS_MICROSERVICE_HOST,
  // products_microservice_port: envVars.PRODUCTS_MICROSERVICE_PORT,
  nats_servers: envVars.NATS_SERVERS,
};
