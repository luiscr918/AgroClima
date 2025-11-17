// src/components/SidebarAgricultor.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, User, LogOut, Plus, Menu, X, Home } from "lucide-react";
import { motion } from "framer-motion";
import { UsuarioService } from "../services/usuarioService";
import type { Usuario } from "../models/Usuario";
import logoAgro from "../assets/logoEmpresa.png";

interface UsuarioAuth {
  id: number;
  email: string;
  rol: string;
}

interface SidebarAgricultorProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  usuario: UsuarioAuth | null;  // ← AHORA ES CORRECTO
  onCerrarSesion: () => void;
}

export const SidebarAgricultor = ({
  sidebarOpen,
  setSidebarOpen,
  usuario,
  onCerrarSesion,
}: SidebarAgricultorProps) => {
  
  const navigate = useNavigate();

  // Estado para guardar LOS DATOS COMPLETOS del usuario desde la BD
  const [usuarioCompleto, setUsuarioCompleto] = useState<Usuario>();

  // Cargar usuario completo al montar
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (usuario?.id) {
          const res = await UsuarioService.getUsuarioById(usuario.id); // ← recibe Usuario completo
          setUsuarioCompleto(res);
        }
      } catch (error) {
        console.error("Error obteniendo datos del usuario:", error);
      }
    };

    fetchUser();
  }, [usuario]);

  const handleCrearTerreno = () => navigate("/nuevo-terreno");

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-linear-to-b from-green-900 to-green-950 text-white shadow-2xl transition-all duration-300 h-screen sticky top-0 overflow-y-auto`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-green-700">
        {sidebarOpen && (
          <div className="flex items-center gap-3 font-bold text-lg">
            <img
              src={logoAgro}
              alt="AgroClima Logo"
              className="w-8 h-8 rounded-md object-cover"
            />
            <span className="text-white">AgroClima</span>
          </div>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-green-800 rounded-lg transition text-green-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => navigate("/dashboard/agricultor")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                     text-gray-300 hover:text-white hover:bg-green-700 group"
        >
          <Home className="w-5 h-5 group-hover:text-green-300" />
          {sidebarOpen && <span className="text-sm font-medium">Inicio</span>}
        </motion.button>

        <motion.button
          whileHover={{ x: 4 }}
          onClick={handleCrearTerreno}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                     text-gray-300 hover:text-white hover:bg-green-700 group"
        >
          <Plus className="w-5 h-5 group-hover:text-green-300" />
          {sidebarOpen && (
            <span className="text-sm font-medium">Nuevo Terreno</span>
          )}
        </motion.button>

        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => navigate("/mis-terrenos")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                     text-gray-300 hover:text-white hover:bg-green-700 group"
        >
          <MapPin className="w-5 h-5 group-hover:text-green-300" />
          {sidebarOpen && (
            <span className="text-sm font-medium">Mis Terrenos</span>
          )}
        </motion.button>

        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => navigate("/profile/agricultor")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                     text-gray-300 hover:text-white hover:bg-green-700 group"
        >
          <User className="w-5 h-5 group-hover:text-green-300" />
          {sidebarOpen && (
            <span className="text-sm font-medium">Perfil</span>
          )}
        </motion.button>
      </nav>

      {/* BOTTOM SECTION */}
      <div className="border-t border-green-700 bg-green-900 bg-opacity-50 space-y-3 p-4">
        {usuarioCompleto && sidebarOpen && (
          <div className="px-3 py-2 bg-green-800 bg-opacity-50 rounded-lg border border-green-700">
            <p className="text-xs text-green-300">Sesión iniciada</p>
            <p className="text-sm font-semibold text-white truncate">
              {usuarioCompleto.nombre} {usuarioCompleto.apellido}
            </p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={onCerrarSesion}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 
                     text-gray-300 hover:text-white hover:bg-green-700 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          {sidebarOpen && (
            <span className="text-sm font-medium">Cerrar Sesión</span>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
};
