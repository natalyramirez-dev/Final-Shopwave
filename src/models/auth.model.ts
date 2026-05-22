
import { User } from "./user.model";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
}

export interface AuthUser {
  email: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}