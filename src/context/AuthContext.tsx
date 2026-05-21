"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/models/auth.model";
import { login as loginService } from "@/services/auth.service";
import { getToken, removeToken, setToken } from "@/utils/token.util";

interface AuthContextValue {
  isAuthenticated: boolean;
  token: string | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setCurrentToken] = useState<string | null>(null);

  useEffect(() => {
    setCurrentToken(getToken());
  }, []);

  const login = async (data: LoginRequest): Promise<void> => {
    const jwt = await loginService(data);
    setToken(jwt);
    setCurrentToken(jwt);
    router.push("/products");
  };

  const logout = (): void => {
    removeToken();
    setCurrentToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
};