"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/models/auth.model";
import { login as loginService } from "@/services/auth.service";
import { getToken, removeToken, setToken } from "@/utils/token.util";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [token, setCurrentToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    setCurrentToken(storedToken);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleAuthError = () => {
      removeToken();
      setCurrentToken(null);
      router.push("/login");
    };

    window.addEventListener("auth-error", handleAuthError);

    return () => {
      window.removeEventListener("auth-error", handleAuthError);
    };
  }, [router]);

  const login = async (data: LoginRequest): Promise<void> => {
    const { token } = await loginService(data);

    setToken(token);
    setCurrentToken(token);

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
        isLoading,
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