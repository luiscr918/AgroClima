// src/context/AuthProvider.tsx
import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";
import type { AuthRequest } from "../models/AuthRequest";
import { authService } from "../services/authService";
import Swal from "sweetalert2";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [usuario, setUsuario] = useState<AuthContextType["usuario"]>(() => {
    const stored = localStorage.getItem("usuario");
    return stored ? JSON.parse(stored) : null;
  });

  // Función para hacer logout
  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  // Función para login
  const login = async (data: AuthRequest) => {
    const res = await authService.login(data);
    setToken(res.token);
    setUsuario(res.usuario);
    localStorage.setItem("token", res.token);
    localStorage.setItem("usuario", JSON.stringify(res.usuario));
  };
  // ⚡ Efecto para controlar expiración del token y cerrar pestaña
  useEffect(() => {
    if (!token) return;

    // Decodificar payload del JWT
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp; // timestamp en segundos
    const tiempoRestante = exp * 1000 - Date.now();

    // Token ya expiró
    if (tiempoRestante <= 0) {
      // Ejecutar logout y alerta asincrónicamente
      setTimeout(() => {
        logout();
        Swal.fire(
          "Sesión expirada",
          "Tu sesión ha caducado, por favor inicia sesión de nuevo.",
          "warning"
        );
      }, 0);
      return;
    }

    // Programar logout automático cuando expire el token
    const timeout = setTimeout(() => {
      logout();
      Swal.fire(
        "Sesión expirada",
        "Tu sesión ha caducado, por favor inicia sesión de nuevo.",
        "warning"
      );
    }, tiempoRestante);

    return () => clearTimeout(timeout);
  }, [token]);
  // Cerrar sesión solo cuando se cierra la pestaña
  useEffect(() => {
    const handlePageHide = (event: PageTransitionEvent) => {
      // Si la página se está recargando => NO cerrar sesión
      if (event.persisted) return;

      // Esto solo corre al cerrar la pestaña o salir del sitio
      logout();
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
