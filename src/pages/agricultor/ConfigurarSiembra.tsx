import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Sprout } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../../context/useAuth";
import type { Siembra } from "../../models/Siembra";
import type { Cultivo } from "../../models/Cultivo";
import { SiembraService } from "../../services/siembraService";
import { CultivoService } from "../../services/cultivoService";
import { SidebarAgricultor } from "../../components/SidebarAgricultor";
import type { Usuario } from "../../models/Usuario";
import { EstadoS } from "../../enums/EstadoS";

export const ConfigurarSiembra = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [siembra, setSiembra] = useState<Siembra | null>(null);
  const [cultivo, setCultivo] = useState<Cultivo | null>(null);
  const [guardando, setGuardando] = useState(false);

  const [formData, setFormData] = useState<{
    fechaSiembra: string;
    estado: EstadoS;
  }>({
    fechaSiembra: "",
    estado: EstadoS.PLANIFICADO,
  });

  // Cargar siembra + cultivo asociado
  useEffect(() => {
    if (!id) return;

    const cargarSiembra = async () => {
      try {
        const data = await SiembraService.getSiembraById(Number(id));
        let cultivoCompleto: Cultivo | undefined = data.cultivo as
          | Cultivo
          | undefined;

        // Igual que en cultivos: si viene solo cultivoId, pedir cultivo completo
        if (!cultivoCompleto && data.cultivoId) {
          cultivoCompleto = await CultivoService.getCultivoById(data.cultivoId);
        }

        setSiembra(data);
        setCultivo(cultivoCompleto ?? null);

        setFormData({
          fechaSiembra: data.fechaSiembra,
          estado: data.estado,
        });
      } catch (err) {
        console.error("Error cargando siembra:", err);
      }
    };

    cargarSiembra();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estado" ? (value as EstadoS) : value,
    }));
  };

  const validarFormulario = () => {
    if (!formData.fechaSiembra.trim())
      return "La fecha de siembra es obligatoria.";
    if (!formData.estado) return "El estado es obligatorio.";
    if (!cultivo) return "No se encontró el cultivo asociado.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siembra) return;

    const error = validarFormulario();
    if (error) {
      Swal.fire("Campos incompletos", error, "warning");
      return;
    }

    setGuardando(true);

    try {
      const siembraActualizada: Siembra = {
        ...siembra,
        fechaSiembra: formData.fechaSiembra,
        estado: formData.estado as EstadoS,
        cultivo: { id: cultivo!.id }, // solo enviamos el id
      };

      await SiembraService.updateSiembra(siembra.id!, siembraActualizada);

      Swal.fire({
        title: "¡Siembra actualizada!",
        text: "Los cambios se guardaron correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => navigate(`/mis-siembras/${cultivo?.id}`), 1500);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Hubo un problema al actualizar la siembra.", "error");
    } finally {
      setGuardando(false);
    }
  };

  if (!siembra || !cultivo)
    return <div className="p-6">Cargando siembra...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAgricultor
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        usuario={usuario as Usuario}
        onCerrarSesion={() => {
          logout();
          navigate("/iniciar-sesion");
        }}
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
              onClick={() => navigate(`/mis-siembras/${cultivo?.id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <Sprout className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Configurar Siembra
            </h1>
          </div>
        </motion.header>

        <div className="px-6 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Editar Siembra
            </h2>
            <p className="text-gray-600 mb-6">
              Siembra asociada al cultivo <strong>{cultivo.nombre}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Fecha siembra */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Fecha de siembra *
                </label>
                <input
                  type="date"
                  name="fechaSiembra"
                  value={formData.fechaSiembra}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  {Object.values(EstadoS).map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={guardando}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  <Save className="w-5 h-5 inline-block" />{" "}
                  {guardando ? "Guardando..." : "Actualizar Siembra"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => navigate(`/mis-siembras/${cultivo.id}`)}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
