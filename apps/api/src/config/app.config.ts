import { registerAs } from '@nestjs/config';

/**
 * `config/*.config.ts` is the only place environment variables are read
 * directly (Phase 1 §7/§9). This file owns process-level concerns (port,
 * environment name, CORS origin). Concern-specific config
 * (`database.config.ts`, `storage.config.ts`, `payment.config.ts`,
 * `auth.config.ts`, `mail.config.ts`) is added in the milestone that
 * introduces each concern — never read ad hoc from inside a service.
 */
export interface AppConfig {
  nodeEnv: 'development' | 'test' | 'staging' | 'production';
  port: number;
  corsOrigin: string[] | boolean;
}

export default registerAs('app', (): AppConfig => ({
  nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
}));
