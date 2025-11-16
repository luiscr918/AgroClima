import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, Eye, Trash2, Edit, Cloud } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import { SidebarAgricultor } from "../../components/SidebarAgricultor";
import { useAuth } from "../../context/useAuth";
import { TerrenoService } from "../../services/terrenoService";
import type { Terreno } from "../../models/Terreno";
import type { Usuario } from "../../models/Usuario";

export const MisTerrenos = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [terrenos, setTerrenos] = useState<Terreno[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Cargar terrenos del usuario desde backend
  useEffect(() => {
    if (!usuario?.id) return;

    TerrenoService.getTerrenosByUsuario(usuario.id)
      .then((data) => setTerrenos(data))
      .catch((err) => console.error("Error cargando terrenos:", err));
  }, [usuario]);

  const handleCerrarSesion = () => {
    logout();
    navigate("/iniciar-sesion");
  };

  // 🔹 SweetAlert2 para eliminar terreno
  const handleEliminar = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await TerrenoService.deleteTerreno(id);
        setTerrenos(terrenos.filter((t) => t.id !== id));
        Swal.fire(
          "Eliminado",
          "El terreno ha sido eliminado correctamente",
          "success"
        );
      } catch (error) {
        console.error("Error eliminando terreno:", error);
        Swal.fire("Error", "No se pudo eliminar el terreno", "error");
      }
    } else {
      Swal.fire("Cancelado", "El terreno no fue eliminado", "info");
    }
  };

  const handleVerDetalles = (id: number) => {
    navigate(`/terreno/${id}`);
  };

  if (!usuario) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAgricultor
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        usuario={usuario as Usuario}
        onCerrarSesion={handleCerrarSesion}
      />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md sticky top-0 z-40"
        >
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">Mis Terrenos</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/nuevo-terreno")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Nuevo Terreno
            </motion.button>
          </div>
        </motion.header>

        <div className="px-6 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800">
              Bienvenido, {usuario.email.split("@")[0]}
            </h2>
            <p className="text-gray-600 mt-2">
              Tienes {terrenos.length} terreno{terrenos.length !== 1 ? "s" : ""}{" "}
              registrado{terrenos.length !== 1 ? "s" : ""}
            </p>
          </motion.div>

          {/* Terrenos Grid */}
          {terrenos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {terrenos.map((terreno, idx) => (
                <motion.div
                  key={terreno.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="bg-linear-to-r from-green-500 to-green-600 text-white p-4">
                    <h4 className="font-bold text-lg">{terreno.nombre}</h4>
                    <p className="flex items-center gap-1 text-sm opacity-90 mt-1">
                      <MapPin className="w-4 h-4" />
                      {terreno.ubicacion}
                    </p>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-sm text-gray-600">
                      <strong>Tipo de Suelo:</strong> {terreno.tipoSuelo}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Tamaño:</strong> {terreno.tamanioHectareas} ha
                    </p>

                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleVerDetalles(terreno.id ?? 0)}
                        className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          navigate(`/configurar-terreno/${terreno.id}`)
                        }
                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleEliminar(terreno.id ?? 0)}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Cloud className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">
                No tienes terrenos registrados aún
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/nuevo-terreno")}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Crear Tu Primer Terreno
              </motion.button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};
