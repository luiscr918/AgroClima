// src/pages/agricultor/DashboardAgricultor.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cloud,
  MapPin,
  Eye,
  Bell,
  TrendingUp,
  Sun,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { SidebarAgricultor } from "../../components/SidebarAgricultor";
import { useAuth } from "../../context/useAuth";

// Recharts
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { TerrenoService } from "../../services/terrenoService";
import { CultivoService } from "../../services/cultivoService";

import type { Terreno } from "../../models/Terreno";
import type { Cultivo } from "../../models/Cultivo";

/**
 * Export nombrado (para que AppRoutes no cambie)
 */
export function DashboardAgricultor() {
  const navigate = useNavigate();
  const { usuario, token, logout } = useAuth();

  const [terrenos, setTerrenos] = useState<Terreno[]>([]);
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabActivo, setTabActivo] = useState("resumen");
  const [loading, setLoading] = useState(true);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!usuario || !token) {
      navigate("/iniciar-sesion");
    }
  }, [usuario, token, navigate]);

  // Cargar los terrenos DEL USUARIO LOGUEADO y sus cultivos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!usuario?.id) return;
        setLoading(true);

        const dataTerrenos = await TerrenoService.getTerrenosByUsuario(usuario.id);
        setTerrenos(dataTerrenos);

        // Obtener cultivos por terreno (acumular)
        const allCultivos: Cultivo[] = [];
        for (const t of dataTerrenos) {
          // Algunos terrenos pueden no tener id definido por TS (por eso t.id!)
          const c = await CultivoService.getCultivosByTerreno(t.id!);
          allCultivos.push(...c);
        }
        setCultivos(allCultivos);
      } catch (err) {
        console.error("Error cargando terrenos o cultivos:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [usuario]);

  const handleCerrarSesion = () => {
    logout();
    navigate("/iniciar-sesion");
  };

  const handleVerTerreno = (id: number) => {
    navigate(`/terreno/${id}`);
  };


  const estadisticas = [
    {
      titulo: "Terrenos Totales",
      valor: terrenos.length,
      icono: MapPin,
      color: "from-green-700 to-green-800",
    },
   
    {
      titulo: "Alertas Activas",
      valor: "—",
      icono: Bell,
      color: "from-green-700 to-green-800",
    },
  ];

  // PRONÓSTICOS (QUEMADOS) — mantenidos como pediste
  const pronostico = [
    { dia: "Hoy", temp: 24, condicion: "Soleado", icon: "☀️" },
    { dia: "Mañana", temp: 22, condicion: "Nublado", icon: "☁️" },
    { dia: "Sábado", temp: 18, condicion: "Lluvia", icon: "🌧️" },
    { dia: "Domingo", temp: 20, condicion: "Mixto", icon: "⛅" },
    { dia: "Lunes", temp: 23, condicion: "Soleado", icon: "☀️" },
    { dia: "Martes", temp: 25, condicion: "Soleado", icon: "☀️" },
    { dia: "Miércoles", temp: 21, condicion: "Nublado", icon: "☁️" },
  ];

 

  // Para pie / barras de cultivos por terreno
  const cultivosPorTerreno = terrenos.map((t) => ({
    nombre: t.nombre,
    total: cultivos.filter((c) => c.terrenoId === t.id).length,
  }));

  const pieCultivos = terrenos.map((t) => ({
    name: t.nombre,
    value: cultivos.filter((c) => c.terrenoId === t.id).length,
  }));

  const PIE_COLORS = ["#16A34A", "#22C55E", "#4ADE80", "#86EFAC", "#A7F3D0"];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (no tocado) */}
      <SidebarAgricultor
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        usuario={usuario}
        onCerrarSesion={handleCerrarSesion}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md sticky top-0 z-40"
        >
          <div className="px-6 py-4 flex items-center justify-start">
            <div className="flex items-center gap-3">
              <Cloud className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Agrícola</h1>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <div className="px-6 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Bienvenido, {usuario?.email?.split("@")[0]}</h2>
            <p className="text-gray-600 mt-2">Aquí puedes gestionar tus terrenos y monitorear el clima en tiempo real</p>
          </motion.div>

          {/* Tabs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-4 mb-8 border-b border-gray-200">
            {["resumen", "pronosticos", "perfil"].map((tab) => (
              <button
                key={tab}
                onClick={() => setTabActivo(tab)}
                className={`px-4 py-3 font-medium transition-all ${tabActivo === tab ? "text-green-600 border-b-2 border-green-600" : "text-gray-600 hover:text-green-600"}`}
              >
                {tab === "resumen" && "Resumen"}
                {tab === "pronosticos" && "Pronósticos"}
                
              </button>
            ))}
          </motion.div>

          {/* TAB: RESUMEN — REEMPLAZADA por gráficos reales (solo esta sección) */}
          {tabActivo === "resumen" && (
            <motion.div key="resumen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Si se está cargando */}
              {loading ? (
                <p className="text-gray-600 animate-pulse">Cargando datos...</p>
              ) : terrenos.length === 0 ? (
                <p className="text-gray-600">No tienes terrenos registrados.</p>
              ) : (
                <>
                  


                  {/* Cultivos: Pie + Bar */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Pie: distribución cultivos por terreno */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h3 className="text-xl font-bold mb-4 text-green-800">Distribución de cultivos por terreno</h3>

                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie data={pieCultivos} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} label>
                            {pieCultivos.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Bars: cultivos por terreno */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h3 className="text-xl font-bold mb-4 text-green-800">Cantidad de cultivos por terreno</h3>

                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={cultivosPorTerreno}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nombre" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="total" fill="#43A047" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </>
              )}
            </motion.div>
          )}

          {/* TAB: PRONÓSTICOS — NO SE TOCA (datos quemados tal como pediste) */}
          {tabActivo === "pronosticos" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Pronóstico 7 Días (ejemplo)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {pronostico.map((dia, idx) => (
                    <div key={idx} className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200">
                      <p className="font-bold text-gray-800">{dia.dia}</p>
                      <p className="text-3xl my-2">{dia.icon}</p>
                      <p className="text-sm text-gray-600">{dia.condicion}</p>
                      <p className="text-lg font-bold text-green-600 mt-2">{dia.temp}°C</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alertas (mantengo tu estilo) */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Alertas Climáticas</h3>
                <div className="space-y-4">
                  {[{
                    tipo: "Riesgo de Helada",
                    descripcion: "Temperatura puede bajar a 0°C en próximas 48hs",
                    urgencia: "alta"
                  },{
                    tipo: "Lluvia Intensa",
                    descripcion: "Se esperan 40mm de precipitación",
                    urgencia: "media"
                  }].map((alerta, i) => (
                    <div key={i} className="bg-green-50 border rounded-lg p-4 flex items-start gap-4">
                      <AlertTriangle className="w-6 h-6 text-green-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800">{alerta.tipo}</h4>
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-800">{alerta.urgencia === "alta" ? "URGENTE" : "MEDIA"}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alerta.descripcion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
