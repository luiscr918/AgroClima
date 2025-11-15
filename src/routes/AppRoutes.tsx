import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import IniciarSesion from "../pages/login";
import Registro from "../pages/registro";
import ConfigurarParcela from "../pages/ConfigurarParcela";
import PanelParcela from "../pages/PanelParcela";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardAgricultor } from "../pages/agricultor/DashboardAgricultor";

export const AppRoutes = () => {
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
