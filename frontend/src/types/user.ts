export type Role = "Member" | "Mod" | "Admin";

export type User = {
  id: string;
  _id?: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  referralCode?: string;
  avatar?: string;
  role?: Role;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};