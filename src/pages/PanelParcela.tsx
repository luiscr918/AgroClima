import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Cloud,
  Droplets,
  Sun,
  AlertCircle,
  Leaf,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import { TerrenoService } from "../services/terrenoService";
import { CultivoService } from "../services/cultivoService";
import { RecomendacionService } from "../services/recomendacionService";
import { PronosticoService } from "../services/pronosticoService";
import { IaService } from "../services/IaService";

import { useAuth } from "../context/useAuth";

import type { Terreno } from "../models/Terreno";
import type { Cultivo } from "../models/Cultivo";
import type { Pronostico } from "../models/Pronostico";
import type { Recomendacion } from "../models/Recomendacion";

type RecomendacionIA = {
  crop: string;
  sowing_window: string;
  notes: string;
};

export default function PanelParcela() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [terreno, setTerreno] = useState<Terreno | null>(null);
  const [pronostico, setPronostico] = useState<Pronostico | null>(null);
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoReco, setCargandoReco] = useState(false);
  const [generandoPronostico, setGenerandoPronostico] = useState(false);

  const hoyStr = () => new Date().toISOString().split("T")[0];

  // ================================
  // CARGA INICIAL (terreno, pronóstico y últimas 3 recomendaciones)
  // ================================
  useEffect(() => {
    if (!id || !usuario) {
      setCargando(false);
      return;
    }

    const terrenoId = Number(id);
    if (isNaN(terrenoId)) {
      setCargando(false);
      return;
    }

    (async () => {
      try {
        // 1) cargar terreno
        const t: Terreno = await TerrenoService.getTerrenoById(terrenoId);
        setTerreno(t);

        // 2) cargar pronósticos del terreno y verificar si ya hay para hoy
        const pronosticos: Pronostico[] =
          await PronosticoService.getPronosticosByTerreno(terrenoId);

        const existenteHoy = pronosticos.find((p) => p.fecha === hoyStr());
        if (existenteHoy) {
          setPronostico(existenteHoy);
        } else {
          // si no existe: generarlo con la IA, guardarlo y setearlo
          try {
            setGenerandoPronostico(true);
            const nuevo = await generarPronosticoIA(t);
            if (nuevo) setPronostico(nuevo);
          } catch (err) {
            // ya está logueado en la función; aquí solo controlamos estado
            console.error("No se pudo generar pronóstico IA al cargar:", err);
          } finally {
            setGenerandoPronostico(false);
          }
        }

        // 3) cargar últimas 3 recomendaciones del usuario (si hay)
        if (usuario?.id) {
          const recos = await RecomendacionService.getRecomendacionesByUsuario(
            usuario.id
          );
          setRecomendaciones(recos.slice(-3).reverse());
        }
      } catch (err) {
        console.error("Error en carga inicial PanelParcela:", err);
      } finally {
        setCargando(false);
      }
    })();
  }, [id, usuario]); // eslint-disable-line react-hooks/exhaustive-deps

  // ================================
  // Generar PRONÓSTICO con IA -> guardar en backend
  // Devuelve el Pronostico creado o null en caso de error
  // ================================
  const generarPronosticoIA = async (
    terrenoData: Terreno
  ): Promise<Pronostico | null> => {
    if (!terrenoData?.id || !terrenoData?.ubicacion) return null;

    try {
      // Prompt: pedimos SOLO JSON (muy importante)
      const prompt = `
Genera un pronóstico climático para uso agrícola en formato JSON EXACTO (sin texto adicional).
Formato esperado:
{
  "temperaturaMinima": number,
  "temperaturaMaxima": number,
  "precipitacion": number,
  "humedad": number,
  "descripcion": string
}
Ubicación: ${terrenoData.ubicacion}
Fecha: ${hoyStr()}

IMPORTANTE: Devuelve solo el JSON sin comentarios ni texto extra.
      `.trim();

      // IaService.generarRecomendacionesIA devuelve un STRING (data.resultado)
      const respuestaTexto: string = await IaService.generarRecomendacionesIA(
        prompt
      );

      // Intentamos parsear la respuesta (si falla, guardamos el raw para depuración)
      let json: any;
      try {
        json = JSON.parse(respuestaTexto);
      } catch (parseErr) {
        console.error(
          "Respuesta IA no es JSON válido (pronóstico). Raw:",
          respuestaTexto
        );
        throw new Error("Respuesta IA no es JSON válido para pronóstico");
      }

      // Validaciones mínimas
      if (
        typeof json.temperaturaMinima !== "number" ||
        typeof json.temperaturaMaxima !== "number" ||
        typeof json.precipitacion !== "number" ||
        typeof json.humedad !== "number" ||
        typeof json.descripcion !== "string"
      ) {
        console.error("JSON pronóstico no cumple esquema:", json);
        throw new Error("JSON pronóstico no cumple esquema");
      }

      // Construir payload para crear el pronóstico en backend
      const payload = {
        fecha: hoyStr(),
        temperaturaMinima: json.temperaturaMinima,
        temperaturaMaxima: json.temperaturaMaxima,
        precipitacion: json.precipitacion,
        humedad: json.humedad,
        descripcion: json.descripcion,
        terreno: { id: terrenoData.id },
      };

      const creado: Pronostico = await PronosticoService.createPronostico(
        payload
      );
      return creado;
    } catch (err) {
      // No derribamos la app: solo log para depuración
      console.error("Error generando/guardando pronóstico IA:", err);
      return null;
    }
  };

  // ================================
  // Generar RECOMENDACIONES con IA -> guardar en backend (y recargar 3 últimas)
  // ================================
  const generarRecomendaciones = async () => {
    if (!terreno?.id || !usuario?.id) return;
    setCargandoReco(true);

    try {
      const cultivos: Cultivo[] = await CultivoService.getCultivosByTerreno(
        terreno.id
      );
      const ultimos3 = cultivos.slice(-3);

      const prompt = `
Eres un asistente agrícola experto. Basándote en estos cultivos, genera recomendaciones en JSON EXACTO.
Formato: devolver SOLO un ARRAY JSON con objetos:
[
  {
    "crop": "Nombre del cultivo",
    "sowing_window": "Periodo de siembra (texto)",
    "notes": "Notas / recomendaciones (texto)"
  }
]

Cultivos:
${ultimos3
  .map(
    (c) => `
- nombre: ${c.nombre}
  tipo: ${c.tipo}
  cicloDias: ${c.cicloDias}
  temporadaOptima: ${c.temporadaOptima}
`
  )
  .join("\n")}

Ubicación: ${terreno.ubicacion}
IMPORTANTE: Devuelve únicamente el JSON sin texto extra.
      `.trim();

      const respuestaTexto: string = await IaService.generarRecomendacionesIA(
        prompt
      );

      let lista: RecomendacionIA[];
      try {
        lista = JSON.parse(respuestaTexto);
        if (!Array.isArray(lista)) throw new Error("No es un array");
      } catch (parseErr) {
        console.error(
          "Respuesta IA no es JSON válido (recomendaciones). Raw:",
          respuestaTexto
        );
        throw new Error("Respuesta IA no es JSON válido para recomendaciones");
      }

      // Guardar cada recomendación en backend
      const fecha = hoyStr();
      for (const r of lista) {
        // validaciones mínimas
        const mensaje = r.notes ?? "";
        const tipo = r.crop ?? "Cultivo";
        await RecomendacionService.createRecomendacion({
          mensaje,
          tipo,
          fechaGeneracion: fecha,
          usuario: { id: usuario.id },
        });
      }

      // recargar últimas 3 recomendaciones desde backend (aseguramos consistencia)
      const recos = await RecomendacionService.getRecomendacionesByUsuario(
        usuario.id
      );
      setRecomendaciones(recos.slice(-3).reverse());
    } catch (err) {
      console.error("Error generando recomendaciones IA:", err);
    } finally {
      setCargandoReco(false);
    }
  };

  // ================================
  // RENDER
  // ================================
  if (cargando)
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-b from-green-50 to-green-100">
        <NavBar />
        <main className="grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4" />
            <p className="text-gray-600">
              Cargando terreno y recomendaciones...
            </p>
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
              onClick={() => navigate("/mis-terrenos")}
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
        {/* Header */}
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
            <h1 className="text-4xl font-bold text-green-800">
              {terreno.nombre}
            </h1>
            <p className="text-gray-600 mt-2">📍 {terreno.ubicacion}</p>
            <p className="text-gray-600">
              📐 Área: {terreno.tamanioHectareas} ha
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Creada:{" "}
              {terreno.createdAt
                ? new Date(terreno.createdAt).toLocaleDateString("es-ES")
                : "-"}
            </p>
          </div>
        </motion.div>

        {/* Clima */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Temperatura</h3>
              <Sun className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-4xl font-bold text-yellow-600 mb-2">
              {pronostico ? `${pronostico.temperaturaMaxima}°C` : "—"}
            </div>
            <div className="text-sm text-gray-600">
              Mín: {pronostico ? `${pronostico.temperaturaMinima}°C` : "—"} |
              Máx: {pronostico ? `${pronostico.temperaturaMaxima}°C` : "—"}
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Precipitación</h3>
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {pronostico ? pronostico.precipitacion.toFixed(1) + " mm" : "—"}
            </div>
            <div className="text-sm text-gray-600">Lluvia esperada hoy</div>
          </motion.div>

          <motion.div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Humedad</h3>
              <Droplets className="w-6 h-6 text-cyan-500" />
            </div>
            <div className="text-4xl font-bold text-cyan-600 mb-2">
              {pronostico ? `${pronostico.humedad.toFixed(0)}%` : "—"}
            </div>
            <div className="text-sm text-gray-600">Humedad relativa</div>
          </motion.div>
        </div>

        {/* Recomendaciones IA */}
        <motion.div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50">
                <Leaf className="w-6 h-6 text-green-700" />
              </div>
              <h2 className="text-2xl font-bold text-green-800">
                Recomendaciones Agrícolas
              </h2>
            </div>

            <button
              onClick={generarRecomendaciones}
              disabled={cargandoReco}
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-gray-400 transition font-medium"
            >
              {cargandoReco ? "Generando..." : "Generar Recomendaciones (IA)"}
            </button>
          </div>

          {recomendaciones && recomendaciones.length > 0 ? (
            <div className="space-y-4">
              {recomendaciones.map((r, idx) => (
                <div
                  key={r.id ?? idx}
                  className="p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <h4 className="font-bold text-green-800 mb-1">{r.tipo}</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Período de siembra:</strong> -{" "}
                    {/* si quieres usar sowing_window, agrega campo en Recomendacion */}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">{r.mensaje}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Cloud className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">
                No tienes recomendaciones aún. Haz clic en Generar
                Recomendaciones (IA) para crear las primeras.
              </p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
