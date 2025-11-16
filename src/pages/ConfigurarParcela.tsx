import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Cloud, Save, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import { SidebarAgricultor } from "../components/SidebarAgricultor";
import { useAuth } from "../context/useAuth";
import { TerrenoService } from "../services/terrenoService";
import type { Usuario } from "../models/Usuario";
import type { Terreno } from "../models/Terreno";

export const ConfigurarParcela = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [terreno, setTerreno] = useState<Terreno | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    tipoSuelo: "",
    tamanioHectareas: "",
  });

  // Cargar terreno por id
  useEffect(() => {
    if (!id) return;
    const terrenoId = Number(id);
    if (isNaN(terrenoId)) return;

    TerrenoService.getTerrenoById(terrenoId)
      .then((data) => {
        setTerreno(data);
        setFormData({
          nombre: data.nombre,
          ubicacion: data.ubicacion,
          tipoSuelo: data.tipoSuelo,
          tamanioHectareas: data.tamanioHectareas.toString(),
        });
      })
      .catch((err) => {
        console.error("Error cargando terreno:", err);
        Swal.fire("Error", "No se pudo cargar el terreno", "error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    if (!formData.nombre.trim()) return "El nombre del terreno es obligatorio.";
    if (!formData.ubicacion.trim()) return "La ubicación es obligatoria.";
    if (!formData.tamanioHectareas.trim())
      return "El tamaño del terreno es obligatorio.";
    if (
      isNaN(Number(formData.tamanioHectareas)) ||
      Number(formData.tamanioHectareas) <= 0
    )
      return "El tamaño debe ser un número mayor a 0.";
    if (!formData.tipoSuelo.trim()) return "Debe seleccionar un tipo de suelo.";
    return null;
  };

  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terreno) return;

    const error = validarFormulario();
    if (error) {
      Swal.fire("Campos incompletos", error, "warning");
      return;
    }

    try {
      const terrenoActualizado: Terreno = {
        ...terreno,
        nombre: formData.nombre,
        ubicacion: formData.ubicacion,
        tipoSuelo: formData.tipoSuelo,
        tamanioHectareas: Number(formData.tamanioHectareas),
      };

      if (!terreno.id) {
        Swal.fire("Error", "El terreno no tiene ID", "error");
        return;
      }

      await TerrenoService.updateTerreno(terreno.id, terrenoActualizado);

      Swal.fire({
        title: "¡Terreno actualizado!",
        text: "Los datos del terreno se actualizaron correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/mis-terrenos"), 1500);
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        "Ocurrió un problema al actualizar el terreno.",
        "error"
      );
    }
  };

  const handleCerrarSesion = () => {
    logout();
    navigate("/iniciar-sesion");
  };

  if (!usuario) return null;
  if (loading) return <div className="p-6">Cargando terreno...</div>;
  if (!terreno)
    return <div className="p-6 text-red-500">Terreno no encontrado</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAgricultor
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        usuario={usuario as Usuario}
        onCerrarSesion={handleCerrarSesion}
      />

      <main className="flex-1 overflow-auto">
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md sticky top-0 z-40"
        >
          <div className="px-6 py-4 flex items-center gap-3">
            <button
              onClick={() => navigate("/mis-terrenos")}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <Cloud className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Actualizar Terreno
            </h1>
          </div>
        </motion.header>

        <div className="px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <form onSubmit={handleActualizar} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nombre del Terreno *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="ej: Terreno Principal"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  />
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    placeholder="ej: Córdoba, Argentina"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  />
                </div>

                {/* Tamaño + Tipo de suelo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tamaño (hectáreas) *
                    </label>
                    <input
                      type="number"
                      name="tamanioHectareas"
                      value={formData.tamanioHectareas}
                      onChange={handleInputChange}
                      step="0.01"
                      placeholder="ej: 50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tipo de Suelo *
                    </label>
                    <select
                      name="tipoSuelo"
                      value={formData.tipoSuelo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                    >
                      <option value="">Selecciona un tipo de suelo</option>
                      <option value="arcilloso">Arcilloso</option>
                      <option value="arenoso">Arenoso</option>
                      <option value="franco">Franco</option>
                      <option value="franco-arcilloso">Franco-Arcilloso</option>
                      <option value="franco-arenoso">Franco-Arenoso</option>
                      <option value="limoso">Limoso</option>
                    </select>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => navigate("/mis-terrenos")}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition"
                  >
                    Cancelar
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
