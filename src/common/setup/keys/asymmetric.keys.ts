import { readFileSync } from 'fs';
import { join } from 'path';

export const privateKey = readFileSync(join(process.cwd(), '/.keys/private.key'));
export const publicKey = readFileSync(join(process.cwd(), '/.keys/public.key'));
