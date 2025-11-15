// src/context/AuthProvider.tsx
import { useState, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";

import type { AuthRequest } from "../models/AuthRequest";
import { authService } from "../services/authService";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [usuario, setUsuario] = useState<AuthContextType["usuario"]>(() => {
    const stored = localStorage.getItem("usuario");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (data: AuthRequest) => {
    const res = await authService.login(data);
    setToken(res.token);
    setUsuario(res.usuario);
    localStorage.setItem("token", res.token);
    localStorage.setItem("usuario", JSON.stringify(res.usuario));
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
