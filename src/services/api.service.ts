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
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      removeToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event('auth-error')); 
      }
      throw new Error("No autorizado o token expirado. Por favor, inicie sesión nuevamente.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || "Error procesando la solicitud");
    }

    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
    
  } catch (error: any) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
};