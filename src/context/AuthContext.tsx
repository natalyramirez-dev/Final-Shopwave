"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/models/auth.model";
import { User } from "@/models/user.model";
import { login as loginService } from "@/services/auth.service";
import { getToken, removeToken, setToken } from "@/utils/token.util";
import { getUser, removeUser, setUser } from "@/utils/user.util";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: User | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [token, setCurrentToken] = useState<string | null>(null);
  const [user, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentToken(getToken());
    setCurrentUser(getUser());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleAuthError = () => {
      removeToken();
      removeUser();
      setCurrentToken(null);
      setCurrentUser(null);
      router.push("/");
    };

    window.addEventListener("auth-error", handleAuthError);

    return () => {
      window.removeEventListener("auth-error", handleAuthError);
    };
  }, [router]);

  /*LOGIN EXITOSO*/
  const login = async (data: LoginRequest): Promise<void> => {
    const { token, user } = await loginService(data);

    setToken(token);   // guarda en localStorage
    setUser(user);     // guarda el usuario en localStorage

    setCurrentToken(token);  // actualiza el estado de React
    setCurrentUser(user);    // actualiza el estado de React

    if (user.role === "ROLE_ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  const logout = (): void => {
    removeToken();
    removeUser();

    setCurrentToken(null);
    setCurrentUser(null);

    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        isLoading,
        token,
        user,
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