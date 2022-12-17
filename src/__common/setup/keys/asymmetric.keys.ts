import { readFileSync } from 'fs';
import { join } from 'path';

export const privateKey = readFileSync(join(__dirname, '../../../../../.keys/private.key'));
export const publicKey = readFileSync(join(__dirname, '../../../../../.keys/public.key'));
