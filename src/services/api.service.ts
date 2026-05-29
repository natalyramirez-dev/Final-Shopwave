import { getToken } from "@/utils/token.util";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const fetchApi = async <T>(
  endpoint: string, // ruta 
  options: RequestInit = {} // peticiones
): Promise<T> => {
  const token = getToken();

  /*Armado de los headers*/
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    // 1. Limpiamos cualquier comilla rara
    let cleanToken = token.replace(/['"]+/g, '').trim();
    
    // 2. Si por algún motivo el token guardado dice "Bearer", se lo arrancamos
    if (cleanToken.toLowerCase().startsWith("bearer")) {
      cleanToken = cleanToken.substring(6).trim();
    }
    
    // 3. ¡ENVIAMOS EL TOKEN DESNUDO! Esto evita que el backend explote por el espacio
    headers.set("Authorization", cleanToken);
  }

  /*nunca guarde en caché esta respuesta. Sin esto Next.js podría mostrarte datos viejos.*/
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store", // Seguimos evitando el caché fantasma de Next.js
  });

  /*ee la respuesta como texto, luego intenta convertirla a JSON*/
  /*Si hay error lanza una excepción con el mensaje del servidor*/
  const text = await response.text();
  let data: any = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = {};
  }

  if (!response.ok || data.error) {
    throw new Error(
      data.error || data.message || "Error procesando la solicitud en el servidor"
    );
  }

  if (response.status === 401) {
    throw new Error("Sesión expirada o token inválido.");
  }

  if (response.status === 403) {
    throw new Error("No tienes permisos para acceder a este recurso.");
  }

  return data as T;
};