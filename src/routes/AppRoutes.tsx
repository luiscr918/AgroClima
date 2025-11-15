import { Route, Routes, useNavigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import IniciarSesion from "../pages/login";
import Registro from "../pages/registro";
import ConfigurarParcela from "../pages/ConfigurarParcela";
import PanelParcela from "../pages/PanelParcela";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardAgricultor } from "../pages/agricultor/DashboardAgricultor";
import { useAuth } from "../context/useAuth";
import { useEffect } from "react";

export const AppRoutes = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate("/iniciar-sesion");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);
  return (
    <Routes>
      {/* Rutas no protegidas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/configurar-parcela" element={<ConfigurarParcela />} />
      <Route path="/parcela/:id" element={<PanelParcela />} />
      <Route path="/iniciar-sesion" element={<IniciarSesion />} />
      <Route path="/registro" element={<Registro />} />
      {/* Rutas protegidas por rol y login */}
      <Route
        path="/dashboard/agricultor"
        element={
          <ProtectedRoute roles={["AGRICULTOR"]}>
            <DashboardAgricultor />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
