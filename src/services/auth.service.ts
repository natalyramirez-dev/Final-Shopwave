import { fetchApi } from "./api.service";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/models/auth.model";

export const login = (data: LoginRequest): Promise<string> => {
  return fetchApi<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(data),
  }).then((response) => response.token);
};

export const register = (data: RegisterRequest): Promise<string> => {
  return fetchApi<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  }).then((response) => response.token);
};