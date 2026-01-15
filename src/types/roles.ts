export const UserRoles = {
  MEMBER: "member",
  STORE: "store",
  GUEST: "guest",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export interface AuthUser {
  id: string;
  role: UserRole;
}

export const ListingRoles = {
  HOST: "HOST",
  OWNER: "OWNER",
  VIEWER: "VIEWER",
} as const;

export type ListingRole = (typeof ListingRoles)[keyof typeof ListingRoles];
