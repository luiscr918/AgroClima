import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cloud,
  MapPin,
  User,
  LogOut,
  Eye,
  Bell,
  TrendingUp,
  Sun,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { SidebarAgricultor } from "../../components/SidebarAgricultor";
import { useAuth } from "../../context/useAuth";


export const DashboardAgricultor = () => {
  const navigate = useNavigate();
  const { usuario, token, logout } = useAuth(); // Usamos el contexto global
  const [terrenos, setTerrenos] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabActivo, setTabActivo] = useState("resumen");

  // Redirigir al login si no hay usuario o token
  useEffect(() => {
    if (!usuario || !token) {
      navigate("/iniciar-sesion");
    }
  }, [usuario, token, navigate]);

  // Simular carga de terrenos
  useEffect(() => {
    setTimeout(() => {
      setTerrenos([
        {
          id: 1,
          nombre: "Terreno Principal",
          ubicacion: "Córdoba, Argentina",
          temperatura: 24,
          humedad: 65,
          viento: 12,
          ultimaActualizacion: "hace 5 minutos",
        },
        {
          id: 2,
          nombre: "Parcela Norte",
          ubicacion: "Córdoba, Argentina",
          temperatura: 22,
          humedad: 70,
          viento: 8,
          ultimaActualizacion: "hace 10 minutos",
        },
        {
          id: 3,
          nombre: "Sector Sur",
          ubicacion: "Córdoba, Argentina",
          temperatura: 26,
          humedad: 58,
          viento: 15,
          ultimaActualizacion: "hace 3 minutos",
        },
      ]);
    }, 500);
  }, []);

  const handleCerrarSesion = () => {
    logout(); // Llama a la función del contexto que limpia usuario y token
    navigate("/iniciar-sesion");
  };

  const handleVerTerreno = (id: number) => {
    navigate(`/terreno/${id}`);
  };

  // Estadísticas, pronósticos y alertas como antes
  const estadisticas = [
    {
      titulo: "Terrenos Totales",
      valor: terrenos.length,
      icono: MapPin,
      color: "from-green-700 to-green-800",
    },
    {
      titulo: "Temp. Promedio",
      valor:
        terrenos.length > 0
          ? Math.round(
              terrenos.reduce((acc, t) => acc + t.temperatura, 0) /
                terrenos.length
            ) + "°C"
          : "0°C",
      icono: Sun,
      color: "from-green-600 to-green-700",
    },
    {
      titulo: "Área Total",
      valor: "150 ha",
      icono: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      titulo: "Alertas Activas",
      valor: "3",
      icono: Bell,
      color: "from-green-700 to-green-800",
    },
  ];

  const pronostico = [
    { dia: "Hoy", temp: 24, condicion: "Soleado", icon: "☀️" },
    { dia: "Mañana", temp: 22, condicion: "Nublado", icon: "☁️" },
    { dia: "Sábado", temp: 18, condicion: "Lluvia", icon: "🌧️" },
    { dia: "Domingo", temp: 20, condicion: "Mixto", icon: "⛅" },
    { dia: "Lunes", temp: 23, condicion: "Soleado", icon: "☀️" },
    { dia: "Martes", temp: 25, condicion: "Soleado", icon: "☀️" },
    { dia: "Miércoles", temp: 21, condicion: "Nublado", icon: "☁️" },
  ];

  const alertas = [
    {
      tipo: "Riesgo de Helada",
      descripcion: "Temperatura puede bajar a 0°C en próximas 48hs",
      urgencia: "alta",
      icono: AlertTriangle,
    },
    {
      tipo: "Lluvia Intensa",
      descripcion: "Se esperan 40mm de precipitación",
      urgencia: "media",
      icono: AlertTriangle,
    },
    {
      tipo: "Onda de Calor",
      descripcion: "Temperaturas superiores a 35°C",
      urgencia: "alta",
      icono: AlertTriangle,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard Agrícola
              </h1>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <div className="px-6 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800">
              Bienvenido, {usuario?.email?.split("@")[0]}
            </h2>
            <p className="text-gray-600 mt-2">
              Aquí puedes gestionar tus terrenos y monitorear el clima en tiempo
              real
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 mb-8 border-b border-gray-200"
          >
            {["resumen", "pronosticos", "perfil"].map((tab) => (
              <button
                key={tab}
                onClick={() => setTabActivo(tab)}
                className={`px-4 py-3 font-medium transition-all ${
                  tabActivo === tab
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                {tab === "resumen" && "Resumen"}
                {tab === "pronosticos" && "Pronósticos"}
                {tab === "perfil" && "Perfil"}
              </button>
            ))}
          </motion.div>

          {/* TAB: RESUMEN */}
          {tabActivo === "resumen" && (
            <motion.div
              key="resumen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {estadisticas.map((stat, idx) => {
                  const IconComponent = stat.icono;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className={`bg-linear-to-br ${stat.color} text-white rounded-lg p-6 shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="opacity-90 text-sm">{stat.titulo}</p>
                          <p className="text-3xl font-bold mt-2">
                            {stat.valor}
                          </p>
                        </div>
                        <IconComponent className="w-12 h-12 opacity-80" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mis Terrenos */}
              <div className="mb-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Mis Terrenos
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {terrenos.map((terreno, idx) => (
                    <motion.div
                      key={terreno.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                    >
                      {/* Header */}
                      <div className="bg-linear-to-r from-green-500 to-green-600 text-white p-4">
                        <h4 className="font-bold text-lg">{terreno.nombre}</h4>
                        <p className="flex items-center gap-1 text-sm opacity-90 mt-1">
                          <MapPin className="w-4 h-4" />
                          {terreno.ubicacion}
                        </p>
                      </div>

                      {/* Weather Info */}
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-green-50 rounded-lg p-2">
                            <p className="text-2xl">🌡️</p>
                            <p className="text-sm font-bold">
                              {terreno.temperatura}°C
                            </p>
                            <p className="text-xs text-gray-600">Temperatura</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2">
                            <p className="text-2xl">💧</p>
                            <p className="text-sm font-bold">
                              {terreno.humedad}%
                            </p>
                            <p className="text-xs text-gray-600">Humedad</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2">
                            <p className="text-2xl">💨</p>
                            <p className="text-sm font-bold">
                              {terreno.viento}km/h
                            </p>
                            <p className="text-xs text-gray-600">Viento</p>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500">
                          Actualizado: {terreno.ultimaActualizacion}
                        </p>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleVerTerreno(terreno.id)}
                          className="w-full mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Detalles
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: PRONÓSTICOS */}
          {tabActivo === "pronosticos" && (
            <motion.div
              key="pronosticos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Pronóstico 7 días */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Pronóstico 7 Días
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {pronostico.map((dia, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200"
                    >
                      <p className="font-bold text-gray-800">{dia.dia}</p>
                      <p className="text-3xl my-2">{dia.icon}</p>
                      <p className="text-sm text-gray-600">{dia.condicion}</p>
                      <p className="text-lg font-bold text-green-600 mt-2">
                        {dia.temp}°C
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Alertas */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Alertas Climáticas
                </h3>
                <div className="space-y-4">
                  {alertas.map((alerta, idx) => {
                    const AlertIcon = alerta.icono;
                    const colorBg =
                      alerta.urgencia === "alta"
                        ? "bg-green-50 border-green-200"
                        : "bg-green-50 border-green-200";
                    const colorBadge =
                      alerta.urgencia === "alta"
                        ? "bg-green-100 text-green-800"
                        : "bg-green-100 text-green-800";

                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ x: 4 }}
                        className={`${colorBg} border rounded-lg p-4 flex items-start gap-4`}
                      >
                        <AlertIcon className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-800">
                              {alerta.tipo}
                            </h4>
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full ${colorBadge}`}
                            >
                              {alerta.urgencia === "alta" ? "URGENTE" : "MEDIA"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {alerta.descripcion}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: PERFIL */}
          {tabActivo === "perfil" && (
            <motion.div
              key="perfil"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                  {/* Avatar */}
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {usuario?.email?.split("@")[0]}
                    </h3>
                    <p className="text-gray-600 mt-1">{usuario?.email}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Agricultor Premium
                    </p>
                  </div>

                  {/* Preferences */}
                  <div className="space-y-4 mb-8">
                    <h4 className="font-bold text-gray-800">
                      Preferencias de Notificaciones
                    </h4>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-gray-700">
                        Alertas de clima extremo
                      </span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-gray-700">Pronósticos diarios</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-gray-700">
                        Recomendaciones de riego
                      </span>
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                    >
                      Guardar Cambios
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCerrarSesion}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};
