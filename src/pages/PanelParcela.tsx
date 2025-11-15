import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Cloud, Droplets, Wind, Sun, AlertCircle, Leaf, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';


export default function PanelParcela() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parcela, setParcela] = useState<any>(null);
  const [clima, setClima] = useState<any>(null);
  const [recomendaciones, setRecomendaciones] = useState<any>(null);
  const [cargandoReco, setCargandoReco] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch(`/api/fields/${id}`).then((r) => r.json()),
    ])
      .then(([parcela_data]) => {
        setParcela(parcela_data);
        // Obtener clima con coordenadas de la parcela
        if (parcela_data.lat && parcela_data.lon) {
          fetch(`/api/weather?lat=${parcela_data.lat}&lon=${parcela_data.lon}`)
            .then((r) => r.json())
            .then(setClima)
            .catch(console.error);
        }
      })
      .catch(console.error)
      .finally(() => setCargando(false));
  }, [id]);

  async function generarRecomendaciones() {
    if (!id) return;
    setCargandoReco(true);
    try {
      const r = await fetch(`/api/fields/${id}/recommendations`, { method: 'POST' });
      const data = await r.json();
      setRecomendaciones(data);
    } catch (e) {
      console.error(e);
      alert('Error generando recomendaciones');
    } finally {
      setCargandoReco(false);
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-b from-green-50 to-green-100">
        <NavBar />
        <main className="grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
            <p className="text-gray-600">Cargando parcela...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!parcela) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-b from-green-50 to-green-100">
        <NavBar />
        <main className="grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Parcela no encontrada</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              Volver al inicio
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Parsear datos del clima
  const datoClima = clima?.data || {};
  const temperatureActual = datoClima.daily?.temperature_2m_max?.[0] || 22;
  const tempMin = datoClima.daily?.temperature_2m_min?.[0] || 15;
  const precipitacion = datoClima.daily?.precipitation_sum?.[0] || 0;
  const velocidadViento = datoClima.hourly?.windspeed_10m?.[0] || 0;

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-green-50 to-green-100">
      <NavBar />

      <main className="grow max-w-6xl w-full mx-auto px-6 py-8">
        {/* Cabecera */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-4xl font-bold text-green-800">{parcela.name}</h1>
            <p className="text-gray-600 mt-2">📍 {parcela.lat?.toFixed(4)}, {parcela.lon?.toFixed(4)}</p>
            {parcela.area && <p className="text-gray-600">📐 Área: {parcela.area} ha</p>}
            <p className="text-xs text-gray-500 mt-3">Creada: {new Date(parcela.createdAt).toLocaleDateString('es-ES')}</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta Temperatura */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Temperatura</h3>
              <Sun className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-4xl font-bold text-yellow-600 mb-2">{temperatureActual}°C</div>
            <div className="text-sm text-gray-600">
              Mín: {tempMin}°C | Máx: {temperatureActual}°C
            </div>
          </motion.div>

          {/* Tarjeta Precipitación */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Precipitación</h3>
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">{precipitacion.toFixed(1)} mm</div>
            <div className="text-sm text-gray-600">Lluvia esperada hoy</div>
          </motion.div>

          {/* Tarjeta Viento */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Viento</h3>
              <Wind className="w-6 h-6 text-cyan-500" />
            </div>
            <div className="text-4xl font-bold text-cyan-600 mb-2">{velocidadViento.toFixed(1)} km/h</div>
            <div className="text-sm text-gray-600">Velocidad actual</div>
          </motion.div>
        </div>

        {/* Sección de Recomendaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
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
              {recomendaciones.recommendations?.recommended_crops ? (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Cultivos Recomendados</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {recomendaciones.recommendations.recommended_crops.map(
                      (cultivo: any, idx: number) => (
                        <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-bold text-green-800 mb-1">{cultivo.crop}</h4>
                          <p className="text-sm text-gray-700">
                            <strong>Período de siembra:</strong> {cultivo.sowing_window}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">{cultivo.notes}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    {recomendaciones.note ||
                      'Las recomendaciones se generaron. Configura tu OPENAI_KEY en el servidor para obtener recomendaciones más personalizadas.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Cloud className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">
                Haz clic en el botón anterior para generar recomendaciones basadas en IA
              </p>
            </div>
          )}
        </motion.div>

        {/* Info de datos climáticos */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>📊 Fuente de datos:</strong> {clima?.source || 'OpenWeatherMap'} - Los datos se actualizan automáticamente
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
