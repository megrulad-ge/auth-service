declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ORIGIN: string;
      PORT: string;
      AUTH_SERVICE_URL: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
    }
  }
}

export {};
