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
    }
  }
}

export {};
