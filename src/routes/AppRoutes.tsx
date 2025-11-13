import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* rutas sin restriccion */}
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};
