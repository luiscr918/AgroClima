import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuth } from "../context/useAuth";
import type { Rol } from "../enums/Rol";

interface ProtectedRouteProps {
  children: ReactElement;
  roles?: Rol[]; //lista de roles permitidos
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  // Si roles está definido y el rol del usuario no está permitido
  if (roles && !roles.includes(usuario.rol!)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
