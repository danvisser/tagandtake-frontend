export const UserRoles = {
  MEMBER: "member",
  STORE: "store",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export interface AuthUser {
  id: string;
  role: UserRole;
}

export const LISTING_ROLES = {
  HOST: "HOST",
  OWNER: "OWNER",
  GUEST: "GUEST",
} as const;

export type ListingRole = (typeof LISTING_ROLES)[keyof typeof LISTING_ROLES];


