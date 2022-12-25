export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export enum RoleStatus {
  LOCKED,
  OPEN,
}

export type UserClaims = {
  uuid: string;
  roles: string[];
  iat: number;
  exp: number;
};
