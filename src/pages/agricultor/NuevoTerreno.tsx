import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cloud, Save, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { SidebarAgricultor } from "../../components/SidebarAgricultor";
import { useAuth } from "../../context/useAuth";


export const NuevoTerreno = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth(); // ✔ usamos tu auth global
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    nombre: "",
    tamanioHectareas: "",
    ubicacion: "",
    tipoSuelo: "",
  });

  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    // Si no hay usuario, ProtectedRoute se encarga, así que NO navegamos aquí
    if (!usuario) return;
  }, [usuario]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      if (
        !formData.nombre ||
        !formData.ubicacion ||
        !formData.tamanioHectareas ||
        !formData.tipoSuelo
      ) {
        alert("Por favor completa todos los campos requeridos");
        setGuardando(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      const nuevoTerreno = {
        id: Date.now(),
        nombre: formData.nombre,
        tamanioHectareas: parseFloat(formData.tamanioHectareas),
        ubicacion: formData.ubicacion,
        tipoSuelo: formData.tipoSuelo,
        usuario: usuario?.email, // ✔ usuario real del context
      };

      // GUARDADO REAL (CONTEXT + SESSIONSTORAGE)
      const terrenos = JSON.parse(
        sessionStorage.getItem("terrenos") || "[]"
      );
      terrenos.push(nuevoTerreno);
      sessionStorage.setItem("terrenos", JSON.stringify(terrenos));

      setMensajeExito("¡Terreno creado exitosamente!");
      setTimeout(() => {
        navigate("/mis-terrenos");
      }, 1500);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el terreno");
    } finally {
      setGuardando(false);
    }
  };

  const handleCerrarSesion = () => {
    logout(); // ✔ cerrar sesión correctamente
    navigate("/iniciar-sesion");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarAgricultor
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        usuario={usuario}
        onCerrarSesion={handleCerrarSesion}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md sticky top-0 z-40"
        >
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard/agricultor")}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <Cloud className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">
                Registrar Nuevo Terreno
              </h1>
            </div>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Crear Nuevo Terreno
              </h2>
              <p className="text-gray-600 mb-8">
                Completa la información de tu terreno para comenzar a monitorear
                el clima
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Campos en fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tamaño */}
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

                  {/* Tipo de suelo */}
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

                {/* Mensaje éxito */}
                {mensajeExito && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium"
                  >
                    ✓ {mensajeExito}
                  </motion.div>
                )}

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
                    {guardando ? "Guardando..." : "Crear Terreno"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => navigate("/dashboard/agricultor")}
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
