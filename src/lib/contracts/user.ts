export type UserRoleDTO = "USER" | "OFFICIAL" | "ADMIN" | string;

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRoleDTO;
  avatar?: string | null;
}

export interface LoginPayloadDTO {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterPayloadDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateProfilePayloadDTO {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordPayloadDTO {
  currentPassword: string;
  newPassword: string;
}

export interface AuthSessionDTO {
  token?: string;
  user?: UserDTO | null;
  expiresAt?: string | null;
}
