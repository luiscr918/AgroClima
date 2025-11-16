import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Cloud, Droplets,  Sun, AlertCircle, Leaf, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { TerrenoService } from '../services/terrenoService';
import { CultivoService } from '../services/cultivoService';
import { RecomendacionService } from '../services/recomendacionService';
import { PronosticoService } from '../services/pronosticoService';
import { useAuth } from '../context/useAuth';
import type { Terreno } from '../models/Terreno';
import type { Cultivo } from '../models/Cultivo';

export type RecomendacionIA = {
  recommendations: {
    crop: string;
    sowing_window: string;
    notes: string;
  }[];
};

export default function PanelParcela() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [terreno, setTerreno] = useState<Terreno | null>(null);
  const [recomendaciones, setRecomendaciones] = useState<RecomendacionIA | null>(null);
  const [cargandoReco, setCargandoReco] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [pronostico, setPronostico] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const terrenoId = Number(id);
    if (isNaN(terrenoId)) return;

    // Cargar terreno
    TerrenoService.getTerrenoById(terrenoId)
      .then((data) => {
        setTerreno(data);

        // ⚡ Generar pronóstico IA
        const generarPronosticoIA = async () => {
          try {
            if (!data.ubicacion) return;

            // 🔥 Reemplazar este bloque por tu llamada real a IA
            const fechaHoy = new Date().toISOString().split('T')[0]; // yyyy-MM-dd
            const respuestaIA = {
              temperaturaMaxima: 25,
              temperaturaMinima: 18,
              precipitacion: 2,
              humedad: 60,
              descripcion: "Parcialmente nublado",
            };

            setPronostico(respuestaIA);

            // Guardar en base de datos
            await PronosticoService.createPronostico({
              ...respuestaIA,
              fecha: fechaHoy,
              terreno: { id: data.id }, // mapeo correcto
            });
          } catch (error) {
            console.error('Error generando pronóstico IA:', error);
          }
        };

        generarPronosticoIA();
      })
      .catch(console.error)
      .finally(() => setCargando(false));

    // Traer últimas 3 recomendaciones del usuario
    if (usuario?.id) {
      RecomendacionService.getRecomendacionesByUsuario(usuario.id)
        .then((data) => {
          if (data.length > 0) {
            const ultimas3 = data.slice(-3).reverse();
            setRecomendaciones({
              recommendations: ultimas3.map((r) => ({
                crop: r.tipo || 'Cultivo',
                sowing_window: '-',
                notes: r.mensaje,
              })),
            });
          }
        })
        .catch(console.error);
    }
  }, [id, usuario]);

  // Generar recomendaciones IA
  const generarRecomendaciones = async () => {
    if (!terreno?.id || !usuario?.id) return;
    setCargandoReco(true);

    try {
      const cultivos: Cultivo[] = await CultivoService.getCultivosByTerreno(terreno.id);
      const ultimos3 = cultivos.slice(-3);

      // Preparar payload para IA
      const payload = ultimos3.map((c) => ({
        nombreCultivo: c.nombre,
        tipo: c.tipo,
        cicloDias: c.cicloDias,
        temporadaOptima: c.temporadaOptima,
        ubicacion: terreno.ubicacion,
      }));

      // 🔥 Reemplazar este bloque por tu llamada real a IA
      const respuestaIA = ultimos3.map((c) => ({
        crop: c.nombre,
        sowing_window: c.temporadaOptima,
        notes: `Recomendación simulada para ${c.nombre} basada en la ubicación ${terreno.ubicacion}`,
      }));

      // Guardar en back
      const fechaHoy = new Date().toISOString().split('T')[0]; // yyyy-MM-dd
      for (const rec of respuestaIA) {
        await RecomendacionService.createRecomendacion({
          mensaje: rec.notes,
          tipo: rec.crop,
          fechaGeneracion: fechaHoy,
          usuario: { id: usuario.id },
        });
      }

      setRecomendaciones({ recommendations: respuestaIA });
    } catch (error) {
      console.error('Error generando recomendaciones IA:', error);
    } finally {
      setCargandoReco(false);
    }
  };

  if (cargando)
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-b from-green-50 to-green-100">
        <NavBar />
        <main className="grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
            <p className="text-gray-600">Cargando terreno y recomendaciones...</p>
          </div>
        </main>
        <Footer />
      </div>
    );

  if (!terreno)
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
            onClick={() => navigate("/mis-terrenos")}
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
              Creada:{" "}
              {terreno.createdAt
                ? new Date(terreno.createdAt).toLocaleDateString("es-ES")
                : "-"}
            </p>
          </div>
        </motion.div>

        {/* Clima y métricas */}
        {pronostico && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Temperatura</h3>
                <Sun className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {pronostico.temperaturaMaxima}°C
              </div>
              <div className="text-sm text-gray-600">
                Mín: {pronostico.temperaturaMinima}°C | Máx: {pronostico.temperaturaMaxima}°C
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Precipitación</h3>
                <Droplets className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {pronostico.precipitacion.toFixed(1)} mm
              </div>
              <div className="text-sm text-gray-600">Lluvia esperada hoy</div>
            </motion.div>

            <motion.div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Humedad</h3>
                <Droplets className="w-6 h-6 text-cyan-500" />
              </div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">
                {pronostico.humedad.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Humedad relativa</div>
            </motion.div>
          </div>
        )}

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
              {cargandoReco ? "Generando..." : "Generar Recomendaciones (IA)"}
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
              <p className="text-gray-600">
                Haz clic en el botón para generar recomendaciones basadas en IA
              </p>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
