// src/pages/siembras/NuevaSiembra.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Cloud, Save, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import { SidebarAgricultor } from "../../components/SidebarAgricultor";
import { useAuth } from "../../context/useAuth";

import type { Siembra } from "../../models/Siembra";
import type { Cultivo } from "../../models/Cultivo";

import { CultivoService } from "../../services/cultivoService";
import { SiembraService } from "../../services/siembraService";
import { EstadoS } from "../../enums/EstadoS";
import type { Usuario } from "../../models/Usuario";

export const NuevaSiembra = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ← ID del cultivo
  const { usuario, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cultivo, setCultivo] = useState<Cultivo | null>(null);

  const [siembra, setSiembra] = useState<Siembra>({
    fechaSiembra: "",
    estado: EstadoS.PLANIFICADO,
  });

  const [guardando, setGuardando] = useState(false);

  // Cargar el cultivo padre
  useEffect(() => {
    if (id) {
      CultivoService.getCultivoById(Number(id))
        .then(setCultivo)
        .catch(() =>
          Swal.fire("Error", "No se pudo cargar el cultivo", "error")
        );
    }
  }, [id]);

  const validar = () => {
    if (!siembra.fechaSiembra) return "Debe seleccionar una fecha.";
    if (!siembra.estado) return "Debe seleccionar un estado.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cultivo) return;

    const err = validar();
    if (err) {
      Swal.fire("Campos incompletos", err, "warning");
      return;
    }

    setGuardando(true);

    try {
      await SiembraService.createSiembra({
        ...siembra,
        cultivo, // ← Se envía el objeto cultivo completo (id incluido)
      });

      Swal.fire({
        title: "¡Siembra creada!",
        text: "La siembra fue registrada correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => navigate(`/mis-siembras/${cultivo.id}`), 1500);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar la siembra.", "error");
    } finally {
      setGuardando(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/iniciar-sesion");
  };

  if (!cultivo) return <div className="p-6">Cargando cultivo...</div>;
  if (!usuario) return null;
  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAgricultor
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        usuario={usuario as Usuario}
        onCerrarSesion={handleLogout}
      />

      <main className="flex-1 overflow-auto">
        {/* HEADER */}
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
              Registrar Nueva Siembra
            </h1>
          </div>
        </motion.header>

        {/* FORMULARIO */}
        <div className="px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Crear nueva siembra
              </h2>

              <p className="text-gray-600 mb-8">
                Esta siembra pertenece al cultivo
                <span className="font-semibold text-green-700">
                  {" "}
                  {cultivo.nombre}
                </span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Fecha */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Fecha de siembra *
                  </label>
                  <input
                    type="date"
                    value={siembra.fechaSiembra}
                    onChange={(e) =>
                      setSiembra({ ...siembra, fechaSiembra: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    value={siembra.estado}
                    onChange={(e) =>
                      setSiembra({
                        ...siembra,
                        estado: e.target.value as EstadoS,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value={EstadoS.PLANIFICADO}>Planificado</option>
                    <option value={EstadoS.ACTIVA}>Activa</option>
                    <option value={EstadoS.COSECHADA}>Cosechada</option>
                  </select>
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={guardando}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium
                    hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {guardando ? "Guardando..." : "Crear Siembra"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg
                    hover:bg-gray-400 transition"
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
