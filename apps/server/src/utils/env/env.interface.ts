export enum EnvMode {
  DEV_ENV = 'development',
  PROD_ENV = 'production',
  TEST_ENV = 'test',
}

export interface IEnv {
  port: number;
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  mongoUri: string;
}
