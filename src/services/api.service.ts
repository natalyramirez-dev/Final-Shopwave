import { getToken, removeToken } from "@/utils/token.util";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    headers.set("Authorization", authToken);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  console.log("Endpoint:", `${API_URL}${endpoint}`);
  console.log("Token usado:", token);
  console.log("Authorization enviado:", headers.get("Authorization"));
  console.log("Status backend:", response.status);

  if (response.status === 401) {
    removeToken();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-error"));
    }

    throw new Error(
      "Sesión expirada, token inválido o token no aceptado por el backend."
    );
  }

  if (response.status === 403) {
    throw new Error(
      "Token válido, pero el usuario no tiene permisos para acceder a este recurso."
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.error ||
        errorData.message ||
        "Error procesando la solicitud"
    );
  }

  const text = await response.text();

  return text ? JSON.parse(text) : ({} as T);
};