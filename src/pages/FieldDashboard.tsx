import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function FieldDashboard() {
  const { id } = useParams();
  const [field, setField] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [reco, setReco] = useState<any>(null);
  const [loadingReco, setLoadingReco] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/fields/${id}`)
      .then((r) => r.json())
      .then((f) => {
        setField(f);
        // fetch weather using the proxy
        if (f && f.lat && f.lon) {
          fetch(`/api/weather?lat=${f.lat}&lon=${f.lon}`)
            .then((r) => r.json())
            .then(setWeather)
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, [id]);

  async function generateRecommendations() {
    if (!id) return;
    setLoadingReco(true);
    try {
      const r = await fetch(`/api/fields/${id}/recommendations`, { method: 'POST' });
      const data = await r.json();
      setReco(data.recommendations ?? data);
    } catch (e) {
      console.error(e);
      alert('Error generando recomendaciones');
    } finally {
      setLoadingReco(false);
    }
  }

  if (!field) return <div className="p-6">Cargando parcela...</div>;

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-green-200">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold text-green-800">{field.name}</h2>
          <div className="text-sm text-gray-600">Lat: {field.lat} · Lon: {field.lon} · Area: {field.area}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Pronóstico (resumen)</h3>
            <pre className="text-xs mt-2 text-gray-600 overflow-auto max-h-48">{JSON.stringify(weather, null, 2)}</pre>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Recomendaciones</h3>
            <div className="mt-3 space-y-3">
              {reco ? (
                <div>
                  <pre className="text-sm text-gray-700">{JSON.stringify(reco, null, 2)}</pre>
                </div>
              ) : (
                <div className="text-sm text-gray-600">Aún no hay recomendaciones generadas.</div>
              )}

              <div className="mt-3">
                <button onClick={generateRecommendations} className="px-4 py-2 bg-green-700 text-white rounded" disabled={loadingReco}>{loadingReco ? 'Generando...' : 'Generar recomendaciones (IA)'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
