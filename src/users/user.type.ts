import { JwtPayload } from 'jsonwebtoken';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  REMOVED = 'REMOVED',
}

export enum RoleStatus {
  LOCKED = 'LOCKED',
  OPEN = 'OPEN',
}

export type UserClaims = JwtPayload & {
  uuid: string;
  roles: string[];
  iat: number;
  exp: number;
};
