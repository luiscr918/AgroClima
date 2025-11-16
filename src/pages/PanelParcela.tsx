import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Cloud,
  Droplets,
  Wind,
  Sun,
  AlertCircle,
  Leaf,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { TerrenoService } from '../services/terrenoService';
import type { Terreno } from '../models/Terreno';

export type Recomendacion = {
  recommendations: {
    crop: string;
    sowing_window: string;
    notes: string;
  }[];
};

export default function PanelParcela() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [terreno, setTerreno] = useState<Terreno | null>(null);
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion | null>(null);
  const [cargandoReco, setCargandoReco] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Datos de clima simulados
  const clima = {
    temperature: 25,
    tempMin: 18,
    precipitacion: 2,
    viento: 10,
  };

  useEffect(() => {
    if (!id) return;

    const terrenoId = Number(id);
    if (isNaN(terrenoId)) return;

    // Cargar terreno desde servicio (puedes reemplazar con tu API real)
    TerrenoService.getTerrenoById(terrenoId)
      .then((data) => setTerreno(data))
      .catch(console.error)
      .finally(() => setCargando(false));
  }, [id]);

  // Generar recomendaciones simuladas (puedes reemplazar con tu API real)
  const generarRecomendaciones = () => {
    setCargandoReco(true);
    setTimeout(() => {
      setRecomendaciones({
        recommendations: [
          { crop: 'Maíz', sowing_window: 'Abril - Junio', notes: 'Riego moderado' },
          { crop: 'Frijol', sowing_window: 'Mayo - Julio', notes: 'Suelo ligeramente ácido' },
        ],
      });
      setCargandoReco(false);
    }, 1000);
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-b from-green-50 to-green-100">
        <NavBar />
        <main className="grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
            <p className="text-gray-600">Cargando terreno...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!terreno) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-b from-green-50 to-green-100">
        <NavBar />
        <main className="grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Terreno no encontrado</p>
            <button
              onClick={() => navigate('/mis-terrenos')}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              Volver a Mis Terrenos
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-green-50 to-green-100">
      <NavBar />

      <main className="grow max-w-6xl w-full mx-auto px-6 py-8">
        {/* Cabecera */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/mis-terrenos')}
            className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-4xl font-bold text-green-800">{terreno.nombre}</h1>
            <p className="text-gray-600 mt-2">📍 {terreno.ubicacion}</p>
            <p className="text-gray-600">📐 Área: {terreno.tamanioHectareas} ha</p>
            <p className="text-xs text-gray-500 mt-3">
              Creada: {terreno.createdAt ? new Date(terreno.createdAt).toLocaleDateString('es-ES') : '-'}
            </p>
          </div>
        </motion.div>

        {/* Clima y métricas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Temperatura</h3>
              <Sun className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-4xl font-bold text-yellow-600 mb-2">{clima.temperature}°C</div>
            <div className="text-sm text-gray-600">Mín: {clima.tempMin}°C | Máx: {clima.temperature}°C</div>
          </motion.div>

          <motion.div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Precipitación</h3>
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">{clima.precipitacion.toFixed(1)} mm</div>
            <div className="text-sm text-gray-600">Lluvia esperada hoy</div>
          </motion.div>

          <motion.div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Viento</h3>
              <Wind className="w-6 h-6 text-cyan-500" />
            </div>
            <div className="text-4xl font-bold text-cyan-600 mb-2">{clima.viento.toFixed(1)} km/h</div>
            <div className="text-sm text-gray-600">Velocidad actual</div>
          </motion.div>
        </div>

        {/* Recomendaciones */}
        <motion.div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50">
                <Leaf className="w-6 h-6 text-green-700" />
              </div>
              <h2 className="text-2xl font-bold text-green-800">Recomendaciones Agrícolas</h2>
            </div>
            <button
              onClick={generarRecomendaciones}
              disabled={cargandoReco}
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-gray-400 transition font-medium"
            >
              {cargandoReco ? 'Generando...' : 'Generar Recomendaciones (IA)'}
            </button>
          </div>

          {recomendaciones ? (
            <div className="space-y-4">
              {recomendaciones.recommendations.map((cultivo, idx) => (
                <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 mb-1">{cultivo.crop}</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Período de siembra:</strong> {cultivo.sowing_window}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">{cultivo.notes}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Cloud className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Haz clic en el botón anterior para generar recomendaciones basadas en IA</p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
