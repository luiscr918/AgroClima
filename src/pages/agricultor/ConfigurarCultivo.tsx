import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Sprout } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../../context/useAuth";
import type { Cultivo } from "../../models/Cultivo";
import { CultivoService } from "../../services/cultivoService";
import { TerrenoService } from "../../services/terrenoService"; // Asegúrate de importar tu servicio de terrenos
import { SidebarAgricultor } from "../../components/SidebarAgricultor";
import type { Usuario } from "../../models/Usuario";

export const ConfigurarCultivo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cultivo, setCultivo] = useState<Cultivo | null>(null);
  const [guardando, setGuardando] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    cicloDias: "",
    temporadaOptima: "",
  });

  // Cargar cultivo por id y su terreno asociado
  useEffect(() => {
    if (!id) return;
    const cultivoId = Number(id);
    if (isNaN(cultivoId)) return;

    const cargarCultivo = async () => {
      try {
        const data = await CultivoService.getCultivoById(cultivoId);
        let terreno = data.terreno;

        // Si no viene completo pero sí existe terrenoId, buscamos el terreno completo
        if (!terreno && data.terrenoId) {
          terreno = await TerrenoService.getTerrenoById(data.terrenoId);
        }

        setCultivo({ ...data, terreno }); // Asignamos el objeto completo del terreno
        setFormData({
          nombre: data.nombre,
          tipo: data.tipo,
          cicloDias: String(data.cicloDias),
          temporadaOptima: data.temporadaOptima,
        });
      } catch (err) {
        console.error("Error cargando cultivo:", err);
      }
    };

    cargarCultivo();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    if (!formData.nombre.trim()) return "El nombre es obligatorio.";
    if (!formData.tipo.trim()) return "El tipo es obligatorio.";
    if (!formData.cicloDias.trim()) return "El ciclo de días es obligatorio.";
    if (isNaN(Number(formData.cicloDias)) || Number(formData.cicloDias) <= 0)
      return "El ciclo debe ser un número mayor a 0.";
    if (!formData.temporadaOptima.trim())
      return "La temporada óptima es obligatoria.";
    if (!cultivo?.terreno) return "No se encontró el terreno asociado.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cultivo) return;

    const error = validarFormulario();
    if (error) {
      Swal.fire("Campos incompletos", error, "warning");
      return;
    }

    setGuardando(true);

    try {
      const cultivoActualizado: Cultivo = {
        ...cultivo,
        nombre: formData.nombre,
        tipo: formData.tipo,
        cicloDias: Number(formData.cicloDias),
        temporadaOptima: formData.temporadaOptima,
        terreno: { id: cultivo.terreno?.id }, // Solo enviamos el id del terreno
      };

      await CultivoService.updateCultivo(cultivo.id!, cultivoActualizado);

      Swal.fire({
        title: "¡Cultivo actualizado!",
        text: "Los cambios se guardaron correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => navigate(`/mis-cultivos/${cultivo.terreno?.id}`), 1500);
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        "Ocurrió un problema al actualizar el cultivo.",
        "error"
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleCerrarSesion = () => {
    logout();
    navigate("/iniciar-sesion");
  };

  if (!cultivo) return <div className="p-6">Cargando cultivo...</div>;

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
              onClick={() => navigate(`/mis-cultivos/${cultivo.terreno?.id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <Sprout className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Configurar Cultivo
            </h1>
          </div>
        </motion.header>

        <div className="px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Editar Cultivo
              </h2>
              <p className="text-gray-600 mb-8">
                Modifica la información del cultivo asociado al terreno{" "}
                <strong>{cultivo.terreno?.nombre}</strong>
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="ej: Maíz"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <input
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    placeholder="ej: Grano"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  />
                </div>

                {/* Ciclo de días */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Ciclo de Días *
                  </label>
                  <input
                    type="number"
                    name="cicloDias"
                    value={formData.cicloDias}
                    onChange={handleInputChange}
                    placeholder="ej: 120"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  />
                </div>

                {/* Temporada óptima */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Temporada Óptima *
                  </label>
                  <input
                    type="text"
                    name="temporadaOptima"
                    value={formData.temporadaOptima}
                    onChange={handleInputChange}
                    placeholder="ej: Primavera"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={guardando}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {guardando ? "Guardando..." : "Actualizar Cultivo"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() =>
                      navigate(`/mis-cultivos/${cultivo.terreno?.id}`)
                    }
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
