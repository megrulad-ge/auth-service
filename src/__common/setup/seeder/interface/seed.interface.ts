export interface SeedInterface {
  readonly name: string;
  run(): Promise<RunReturnType>;
  markAsRun(): Promise<void>;
  hasRun(): Promise<boolean>;
}

export type RunReturnType = { hasRun: boolean; name: string; error?: string };
