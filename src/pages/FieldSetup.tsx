import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FieldSetup() {
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch('/api/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lat, lon, area }),
      });
      const data = await r.json();
      navigate(`/field/${data.id}`);
    } catch (err) {
      console.error(err);
      alert('Error creando parcela (simulado)');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-green-50 to-green-200 p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold text-green-800">Configura tu parcela</h2>
        <p className="text-sm text-gray-600">Introduce la ubicación y datos básicos para generar recomendaciones.</p>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm text-gray-700">Nombre de la parcela</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border px-3 py-2" required />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="text-sm text-gray-700">Latitud</span>
              <input value={lat} onChange={(e) => setLat(e.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="e.g. 39.4667" required />
            </label>
            <label>
              <span className="text-sm text-gray-700">Longitud</span>
              <input value={lon} onChange={(e) => setLon(e.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="e.g. -0.3750" required />
            </label>
          </div>

          <label>
            <span className="text-sm text-gray-700">Área (ha)</span>
            <input value={area} onChange={(e) => setArea(e.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="ej. 1.5" />
          </label>

          <div className="flex items-center gap-3 mt-4">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-700 text-white rounded">{loading ? 'Creando...' : 'Crear parcela'}</button>
            <button type="button" onClick={() => { setName(''); setLat(''); setLon(''); setArea(''); }} className="px-3 py-2 border rounded">Limpiar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
