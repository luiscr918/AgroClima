import { Route, Routes, useNavigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import IniciarSesion from "../pages/login";
import Registro from "../pages/registro";
import ConfigurarParcela from "../pages/ConfigurarParcela";
import PanelParcela from "../pages/PanelParcela";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardAgricultor } from "../pages/agricultor/DashboardAgricultor";
import { NuevoTerreno } from "../pages/agricultor/NuevoTerreno";
import { MisTerrenos } from "../pages/agricultor/MisTerrenos";
import { useAuth } from "../context/useAuth";
import { useEffect } from "react";

export const AppRoutes = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario && !['/iniciar-sesion', '/', '/registro'].includes(window.location.pathname)) {
      navigate("/iniciar-sesion");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  return (
    <Routes>
      {/* Rutas no protegidas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardAgricultor />} />
      <Route path="/configurar-terreno" element={<ConfigurarParcela />} />
      <Route path="/terreno/:id" element={<PanelParcela />} />
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
      <Route
        path="/nuevo-terreno"
        element={
          <ProtectedRoute roles={["AGRICULTOR"]}>
            <NuevoTerreno />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mis-terrenos"
        element={
          <ProtectedRoute roles={["AGRICULTOR"]}>
            <MisTerrenos />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
