import { LoginRequest, RegisterRequest } from "@/models/auth.model";
import { User } from "@/models/user.model";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const login = async (data: LoginRequest): Promise<{ token: string; user: User }> => {
  const basicToken = btoa(`${data.email}:${data.password}`);

  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${basicToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Credenciales inválidas");
  }

  const jwt = response.headers.get("Authorization");

  if (!jwt) {
    throw new Error("No se recibió token JWT");
  }

  const user: User = await response.json();

  return { token: jwt, user };
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "No se pudo registrar el usuario");
  }

  return await response.json();
};