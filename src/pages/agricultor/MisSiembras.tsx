// src/pages/siembras/MisSiembras.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit, Cloud, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../../context/useAuth";
import type { Siembra } from "../../models/Siembra";
import { SiembraService } from "../../services/siembraService";
import { SidebarAgricultor } from "../../components/SidebarAgricultor";
import type { Usuario } from "../../models/Usuario";
import { CultivoService } from "../../services/cultivoService";
import { UsuarioService } from "../../services/usuarioService";

export const MisSiembras = () => {
  const { id } = useParams<{ id: string }>(); // id del cultivo
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [siembras, setSiembras] = useState<Siembra[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [nombreCultivo, setNombreCultivo] = useState<string>("");
  const [nombreUsuario, setNombreUsuario] = useState<string>("");
  const [apellidoUsuario, setApellidoUsuario] = useState<string>("");

  // Cargar siembras + nombre del cultivo
  useEffect(() => {
    if (!id) return;
    const cultivoId = Number(id);
    if (isNaN(cultivoId)) return;

    async function cargarTodo() {
      try {
        // 1️⃣ Traer siembras
        const data = await SiembraService.getSiembrasByCultivo(cultivoId);
        setSiembras(data);

        // 2️⃣ Traer cultivo para obtener su nombre
        const cultivo = await CultivoService.getCultivoById(cultivoId);
        setNombreCultivo(cultivo.nombre ?? "Cultivo");
        //traer usuario para obtener nombre completo (solo si tenemos usuario.id)
        if (usuario?.id) {
          const usuarioCompleto = await UsuarioService.getUsuarioById(
            usuario.id
          );
          if (usuarioCompleto) {
            setNombreUsuario(usuarioCompleto.nombre ?? "");
            setApellidoUsuario(usuarioCompleto.apellido ?? "");
          }
        }
      } catch (err) {
        console.error("Error cargando siembras:", err);
      } finally {
        setLoading(false);
      }
    }

    cargarTodo();
  }, [id, usuario?.id]);

  const handleCerrarSesion = () => {
    logout();
    navigate("/iniciar-sesion");
  };

  const handleEliminar = async (siembraId?: number) => {
    if (!siembraId) return;
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
        await SiembraService.deleteSiembra(siembraId);
        setSiembras((prev) => prev.filter((s) => s.id !== siembraId));
        Swal.fire("Eliminado", "La siembra ha sido eliminada", "success");
      } catch (error) {
        console.error("Error eliminando siembra:", error);
        Swal.fire("Error", "No se pudo eliminar la siembra", "error");
      }
    }
  };

  if (!usuario) return null;
  if (loading) return <p className="p-6">Cargando siembras...</p>;

  const fmtDate = (d?: string) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString("es-ES");
    } catch {
      return d;
    }
  };

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
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <Cloud className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Mis Siembras – {nombreCultivo}
            </h1>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/nueva-siembra/${id}`)}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Nueva Siembra
            </motion.button>
          </div>
        </motion.header>

        <div className="px-6 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800">
              Bienvenido, {nombreUsuario} {apellidoUsuario}
            </h2>
            <p className="text-gray-600 mt-2">
              Este cultivo tiene {siembras.length} siembra
              {siembras.length !== 1 ? "s" : ""}
            </p>
          </motion.div>

          {/* Siembras Grid */}
          {siembras.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siembras.map((siembra, idx) => (
                <motion.div
                  key={siembra.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="bg-linear-to-r from-yellow-500 to-yellow-600 text-white p-4">
                    {/* 🔥 Contador en vez del id */}
                    <h4 className="font-bold text-lg">Siembra #{idx + 1}</h4>
                  </div>

                  <div className="p-4 space-y-2 text-gray-600">
                    <p>
                      <strong>Fecha de siembra:</strong>{" "}
                      {fmtDate(siembra.fechaSiembra)}
                    </p>
                    <p>
                      <strong>Estado:</strong> {String(siembra.estado)}
                    </p>
                    <p>
                      <strong>Cultivo:</strong> {nombreCultivo}
                    </p>
                  </div>

                  <div className="p-4 flex gap-2 border-t border-gray-200">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        navigate(`/configurar-siembra/${siembra.id}`)
                      }
                      className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium flex justify-center items-center gap-2"
                    >
                      <Edit className="w-4 h-4" /> Editar
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEliminar(siembra.id)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium flex justify-center items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </motion.button>
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
                Este cultivo no tiene siembras registradas aún
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/nueva-siembra/${id}`)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" /> Crear Nueva Siembra
              </motion.button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};
