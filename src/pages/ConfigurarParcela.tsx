import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';

import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function ConfigurarParcela() {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [suggestiones, setSuggestiones] = useState<any[]>([]);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [area, setArea] = useState('');
  const [cargando, setCargando] = useState(false);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Geocodificación con OpenStreetMap Nominatim (libre, sin API key)
  async function buscarUbicacion(query: string) {
    if (query.length < 2) {
      setSuggestiones([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=es`
      );
      const data = await response.json();
      setSuggestiones(data);
    } catch (err) {
      console.error('Error buscando ubicación:', err);
      setSuggestiones([]);
    }
  }

  function handleUbicacionChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = e.target.value;
    setUbicacion(valor);

    // Debounce para no saturar con requests
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      buscarUbicacion(valor);
    }, 300);
  }

  function seleccionarUbicacion(sugerencia: any) {
    const displayName = sugerencia.display_name || sugerencia.name;
    setUbicacionSeleccionada(displayName);
    setUbicacion(displayName);
    setLat(sugerencia.lat);
    setLon(sugerencia.lon);
    setSuggestiones([]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!lat || !lon) {
      alert('Por favor selecciona una ubicación válida');
      return;
    }

    setCargando(true);
    try {
      const response = await fetch('/api/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nombre,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          area: area ? parseFloat(area) : 0,
        }),
      });

      if (!response.ok) throw new Error('Error al crear parcela');

      const data = await response.json();
      navigate(`/parcela/${data.id}`);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al crear la parcela. Por favor intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-green-50 to-green-100">
      <NavBar />

      <main className="grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-green-50">
              <MapPin className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-800">Configura tu Parcela</h1>
              <p className="text-sm text-gray-600">Define la ubicación y datos básicos para obtener recomendaciones personalizadas</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Nombre de la parcela */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Parcela *
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="ej. Parcela Norte, Campo A, Viñedo Principal"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Búsqueda de ubicación */}
            <div>
              <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación (Ciudad, Municipio o Dirección) *
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="ubicacion"
                    type="text"
                    value={ubicacion}
                    onChange={handleUbicacionChange}
                    placeholder="ej. Valencia, Sevilla, Madrid..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>

                {/* Dropdown de sugerencias */}
                {suggestiones.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {suggestiones.map((sugerencia, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => seleccionarUbicacion(sugerencia)}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 border-b last:border-b-0 transition"
                      >
                        <div className="font-medium text-gray-800">{sugerencia.name}</div>
                        <div className="text-xs text-gray-500">{sugerencia.display_name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {ubicacionSeleccionada && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <strong>Ubicación seleccionada:</strong> {ubicacionSeleccionada}
                    <br />
                    <span className="text-xs text-green-700">
                      Coordenadas: {lat}, {lon}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Área de la parcela */}
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                Área de la Parcela (hectáreas)
              </label>
              <input
                id="area"
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="ej. 1.5"
                step="0.1"
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-500 mt-1">Este dato es opcional pero ayuda a personalizar las recomendaciones</p>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={cargando || !lat || !lon}
                className="flex-1 px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 disabled:bg-gray-400 transition shadow-md"
              >
                {cargando ? 'Creando parcela...' : 'Crear Parcela'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNombre('');
                  setUbicacion('');
                  setUbicacionSeleccionada('');
                  setLat('');
                  setLon('');
                  setArea('');
                  setSuggestiones([]);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Limpiar
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>💡 Consejo:</strong> La ubicación se obtiene usando mapas de OpenStreetMap. Selecciona el resultado más cercano a tu parcela para mayor precisión en los pronósticos.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
