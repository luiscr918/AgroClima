import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import IniciarSesion from "../pages/login";
import Registro from "../pages/registro";
import ConfigurarParcela from "../pages/ConfigurarParcela";
import PanelParcela from "../pages/PanelParcela";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/configurar-parcela" element={<ConfigurarParcela />} />
      <Route path="/parcela/:id" element={<PanelParcela />} />
      <Route path="/iniciar-sesion" element={<IniciarSesion />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  );
};
