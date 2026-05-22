import { LoginRequest, RegisterRequest } from "@/models/auth.model";

// BUENA PRÁCTICA: Si el compañero olvida el .env, no se cae la app, usa el localhost por defecto.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const login = async (data: LoginRequest): Promise<string> => {
  const basicToken = btoa(`${data.email}:${data.password}`);

  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${basicToken}`,
    },
  });

  if (!response.ok) {
    // Manejo de errores profesional exigido por el PDF
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || "Error al iniciar sesión. Verifique sus credenciales.");
  }

  const jwt = response.headers.get("Authorization");

  if (!jwt) {
    throw new Error("No se recibió token JWT por parte del servidor.");
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
    // Capturamos el error real del backend (ej: "Email ya registrado")
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || "No se pudo registrar el usuario. Intente nuevamente.");
  }
};