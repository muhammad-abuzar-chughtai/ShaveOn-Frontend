export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresAtUtc: string;
  userId: number;
  fullName: string;
  email: string;
  role: 'Admin' | 'Customer';
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
