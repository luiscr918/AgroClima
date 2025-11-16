import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import IniciarSesion from "../pages/login";
import Registro from "../pages/registro";

import PanelParcela from "../pages/PanelParcela";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardAgricultor } from "../pages/agricultor/DashboardAgricultor";

import { MisTerrenos } from "../pages/agricultor/MisTerrenos";
import { Rol } from "../enums/Rol";
import { ProfileAgricultor } from "../pages/agricultor/ProfileAgricultor";
import { NuevoTerreno } from "../pages/agricultor/NuevoTerreno";
import { ConfigurarParcela } from "../pages/ConfigurarParcela";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas no protegidas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/iniciar-sesion" element={<IniciarSesion />} />
      <Route path="/registro" element={<Registro />} />
      {/* Rutas protegidas por rol y login */}
      <Route
        path="/dashboard/agricultor"
        element={
          <ProtectedRoute roles={[Rol.AGRICULTOR]}>
            <DashboardAgricultor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nuevo-terreno"
        element={
          <ProtectedRoute roles={[Rol.AGRICULTOR]}>
            <NuevoTerreno />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mis-terrenos"
        element={
          <ProtectedRoute roles={[Rol.AGRICULTOR]}>
            <MisTerrenos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/configurar-terreno/:id"
        element={
          <ProtectedRoute roles={[Rol.AGRICULTOR]}>
            <ConfigurarParcela />
          </ProtectedRoute>
        }
      />
      <Route
        path="/terreno/:id"
        element={
          <ProtectedRoute roles={[Rol.AGRICULTOR]}>
            <PanelParcela />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/agricultor"
        element={
          <ProtectedRoute roles={[Rol.AGRICULTOR]}>
            <ProfileAgricultor />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
