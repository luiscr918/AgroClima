import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Cloud, Plus, Trash2, Edit, Bean } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../../context/useAuth";
import type { Cultivo } from "../../models/Cultivo";
import { CultivoService } from "../../services/cultivoService";
import { SidebarAgricultor } from "../../components/SidebarAgricultor";
import type { Usuario } from "../../models/Usuario";

export const MisCultivos = () => {
  const { id } = useParams<{ id: string }>(); // id del terreno
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // Cargar cultivos del terreno
  useEffect(() => {
    if (!id) return;
    const terrenoId = Number(id);
    if (isNaN(terrenoId)) return;

    CultivoService.getCultivosByTerreno(terrenoId)
      .then((data) => setCultivos(data))
      .catch((err) => console.error("Error cargando cultivos:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCerrarSesion = () => {
    logout();
    navigate("/iniciar-sesion");
  };

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
        await CultivoService.deleteCultivo(id);
        setCultivos(cultivos.filter((c) => c.id !== id));
        Swal.fire(
          "Eliminado",
          "El cultivo ha sido eliminado correctamente",
          "success"
        );
      } catch (error) {
        console.error("Error eliminando cultivo:", error);
        Swal.fire("Error", "No se pudo eliminar el cultivo", "error");
      }
    } else {
      Swal.fire("Cancelado", "El cultivo no fue eliminado", "info");
    }
  };

  if (!usuario) return null;
  if (loading) return <p className="p-6">Cargando cultivos...</p>;

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
          <div className="px-6 py-4 flex items-center gap-3">
            <Cloud className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">Mis Cultivos</h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/nuevo-cultivo/${id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Nuevo Cultivo
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
              Este terreno tiene {cultivos.length} cultivo
              {cultivos.length !== 1 ? "s" : ""}
            </p>
          </motion.div>

          {/* Cultivos Grid */}
          {cultivos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cultivos.map((cultivo, idx) => (
                <motion.div
                  key={cultivo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="bg-linear-to-r from-green-500 to-green-600 text-white p-4">
                    <h4 className="font-bold text-lg">{cultivo.nombre}</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Tipo de Cultivo:</strong> {cultivo.tipo}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Temporada Óptima:</strong> {cultivo.temporadaOptima}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Ciclo de Días:</strong> {cultivo.cicloDias}
                  </p>

                  <div className="p-4 space-y-3">
                    <div className="flex gap-1 pt-3 border-t border-gray-200">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          navigate(`/configurar-cultivo/${cultivo.id}`)
                        }
                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition flex items-center justify-center gap-2"
                        onClick={() => handleEliminar(cultivo.id ?? 0)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </motion.button>
                      {/* 🔹 Nuevo botón Mis Siembras */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/mis-siembras/${cultivo.id}`)}
                        className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition flex items-center justify-center gap-2"
                      >
                        <Bean className="w-4 h-4" />
                        Mis Siembras
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
                Este terreno no tiene cultivos registrados aún
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/nuevo-cultivo/${id}`)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Crear Nuevo Cultivo
              </motion.button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};
