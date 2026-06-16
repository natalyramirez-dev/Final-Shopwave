const TOKEN_KEY = "shopwave_token";

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const hasToken = (): boolean => {
  return Boolean(getToken());
};

export interface DecodedToken {
  sub: string;
  roles?: string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export const decodeToken = (jwt: string): DecodedToken | null => {
  try {
    const payload = jwt.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as DecodedToken;
  } catch {
    return null;
  }
};

export const isTokenExpired = (jwt: string): boolean => {
  const decoded = decodeToken(jwt);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};