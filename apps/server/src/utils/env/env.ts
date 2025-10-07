import { EnvMode, IEnv } from './env.interface';

const processEnvMode = process.env.NODE_ENV?.toLowerCase() as EnvMode;

const envMode = Object.values(EnvMode).includes(processEnvMode) ? processEnvMode : EnvMode.DEV_ENV;

const isEnv = (mode: EnvMode) => envMode.toLowerCase() === mode;

export const getEnvMode = () => envMode;

export const isDevEnv = () => isEnv(EnvMode.DEV_ENV);

export const isProdEnv = () => isEnv(EnvMode.PROD_ENV);

export const isTestEnv = () => isEnv(EnvMode.TEST_ENV);

const mapEnvValues = {
  bool: (envValue: string) => envValue === 'true',
  number: (envValue: string, defaultValue: number) => {
    const value = Number(envValue);

    return Number.isNaN(value) ? defaultValue : value;
  },
};

const mapEnv = (envData: NodeJS.ProcessEnv) => {
  const { PORT = '', SUPABASE_URL = '', SUPABASE_SERVICE_ROLE_KEY = '', MONGO_URI = '' } = envData;

  const defaultPort = 5000;
  console.log('⚠️ ❌ ', processEnvMode);

  const parsed: IEnv = {
    port: mapEnvValues.number(PORT, defaultPort),
    supabaseUrl: SUPABASE_URL,
    supabaseServiceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
    mongoUri: MONGO_URI,
  };

  return Object.freeze(parsed);
};

export const env = mapEnv(process.env);

export default {
  isDevEnv,
  isProdEnv,
  isTestEnv,
  getEnvMode,
  env,
};
