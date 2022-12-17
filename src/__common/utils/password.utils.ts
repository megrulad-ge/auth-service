import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class PasswordUtils {
  public static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;

    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (error, hash) => {
        if (error) return reject(error);

        resolve(hash);
      });
    });
  }

  public static async hashCompare(clearText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(clearText, hashed);
  }

  public static randomChars(len: number): string {
    return crypto.randomBytes(len / 2).toString('hex');
  }

  public static createHashFromBuffer(fileBuffer: string): string {
    const checksum = crypto.createHash('sha256');
    checksum.update(fileBuffer);

    return checksum.digest('hex');
  }
}
