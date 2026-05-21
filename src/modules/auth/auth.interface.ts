export const userRole = ["contributor", "maintainer"] as const;

export type Role = (typeof userRole)[number];

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: Role;
}
