function getEnvVar(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Отсутствует обязательная переменная окружения: ${key}`);
  }

  return value;
}

export const config = {
  api: {
    baseUrl: getEnvVar('VITE_API_URL'),
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
