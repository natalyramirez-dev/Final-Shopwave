import { LoginRequest, RegisterRequest } from "@/models/auth.model";
import { User } from "@/models/user.model";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/*LOGICA LOGIN*/
export const login = async ( data: LoginRequest ): Promise<{ token: string; user: User }> => 
{
  const basicToken = btoa(`${data.email}:${data.password}`);

  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${basicToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        "Credenciales inválidas. Intente nuevamente."
    );
  }

  const authorizationHeader = response.headers.get("Authorization");

  if (!authorizationHeader) {
    throw new Error("El servidor no proporcionó un token válido.");
  }

  const token = authorizationHeader.startsWith("Bearer ")
    ? authorizationHeader.replace("Bearer ", "")
    : authorizationHeader;

  const user: User = await response.json();

  return { token, user };
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
    throw new Error(
      errorData.message ||
        errorData.error ||
        "No se pudo procesar el registro del usuario."
    );
  }

  return await response.json();
};