declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ORIGIN: string;
      PORT: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      SUPER_USER_PASSWORD: string;
      ACCESS_TOKEN_EXPIRES_IN: string;
      REFRESH_TOKEN_EXPIRES_IN: string;
    }
  }
}

export {};
