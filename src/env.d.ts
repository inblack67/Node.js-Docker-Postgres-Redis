declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    DB_URL: string;
    REDIS_URL: string;
  }
}
