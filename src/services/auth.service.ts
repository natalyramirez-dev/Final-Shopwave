import { LoginRequest, RegisterRequest } from "@/models/auth.model";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (data: LoginRequest): Promise<string> => {
  const basicToken = btoa(`${data.email}:${data.password}`);

  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${basicToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Credenciales inválidas");
  }

  const jwt = response.headers.get("Authorization");

  if (!jwt) {
    throw new Error("No se recibió token JWT");
  }

  return jwt;
};

export const register = async (data: RegisterRequest): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      mobile: data.mobile,
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo registrar el usuario");
  }
};