import bcrypt from 'bcrypt';
import { PasswordUtils } from './password.utils';

describe('PasswordUtils', () => {
  describe('hashPassword', () => {
    it('should hash password and return string', async () => {
      const password = 'veryStrongPassword321';
      const hashed = await PasswordUtils.hashPassword(password);
      expect(hashed).toEqual(expect.any(String));
    });

    it('should hash two passwords and compare', async () => {
      const passwordOne = 'veryStrongPassword321';
      const passwordTwo = 'veryStrongPassword321';
      const passwordThree = 'somethingElse';
      const hashedOne = await PasswordUtils.hashPassword(passwordOne);
      const hashedTwo = await PasswordUtils.hashPassword(passwordTwo);
      const hashedThree = await PasswordUtils.hashPassword(passwordThree);
      expect(hashedOne).not.toBe(hashedTwo);
      expect(hashedOne).not.toBe(hashedThree);
      expect(hashedThree).not.toBe(hashedTwo);
    });
  });

  describe('hashCompare', () => {
    it('should compare hashed password with passed value', async () => {
      const password = 'veryStrongPassword321';
      const hashed = await PasswordUtils.hashPassword(password);
      const hashedAgain = await PasswordUtils.hashPassword(password);

      const isValid = await PasswordUtils.hashCompare(password, hashed);
      const isValidAgain = await PasswordUtils.hashCompare(password, hashedAgain);
      expect(isValid).toBeTruthy();
      expect(isValidAgain).toBeTruthy();
      // They are not the same
      expect(hashed).not.toBe(hashedAgain);
    });

    it('should reject', async () => {
      type Callback = (error: string, hash: null) => string;
      // @ts-ignore
      jest.spyOn(bcrypt, 'hash').mockImplementation((password: string, saltRounds: number, callback: Callback) => {
        callback('ERROR:Rejected', null);
      });
      const password = 'veryStrongPassword321';
      await PasswordUtils.hashPassword(password).catch((error) => {
        expect(error).toBe('ERROR:Rejected');
      });
    });
  });

  describe('randomChars', () => {
    it('should generate random chars', () => {
      const chars = PasswordUtils.randomChars(10);
      expect(chars).toEqual(expect.any(String));
      expect(chars).toHaveLength(10);
    });
  });

  describe.each([
    ['123', 64],
    ['', 64],
    ['short text', 64],
    ['very long text 123 haha..hmmm', 64],
  ])(
    'PasswordUtils.createHashFromBuffer(%s) => should generate hash from buffer with len: %d',
    (value, expectedLength) => {
      expect(PasswordUtils.createHashFromBuffer(value)).toHaveLength(expectedLength);
    },
  );
});
