const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// In-memory store for demo (replace with DB)
const fields = new Map();
let nextId = 1;

app.post('/api/fields', (req, res) => {
  const { name, lat, lon, area } = req.body;
  const id = String(nextId++);
  const field = { id, name, lat, lon, area, createdAt: Date.now() };
  fields.set(id, field);
  res.json(field);
});

app.get('/api/fields/:id', (req, res) => {
  const f = fields.get(req.params.id);
  if (!f) return res.status(404).json({ error: 'Not found' });
  res.json(f);
});

// Simple weather proxy: prefer OpenWeatherMap if key provided and WEATHER_API env says openweathermap
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });

  try {
    if (process.env.WEATHER_API === 'openweathermap' && process.env.WEATHER_KEY) {
      const key = process.env.WEATHER_KEY;
      const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
      const r = await fetch(url);
      const data = await r.json();
      return res.json({ source: 'openweathermap', data });
    }

    // Fallback to open-meteo (no key required)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,winddirection_10m,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7`;
    const r = await fetch(url);
    const data = await r.json();
    return res.json({ source: 'open-meteo', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'weather proxy error' });
  }
});

// Recommendations endpoint: uses OpenAI if OPENAI_KEY is set and openai package available, otherwise returns simulated recommendations
app.post('/api/fields/:id/recommendations', async (req, res) => {
  const f = fields.get(req.params.id);
  if (!f) return res.status(404).json({ error: 'Field not found' });

  // Gather data (for demo we'll fetch weather)
  const lat = f.lat;
  const lon = f.lon;
  let weather = null;
  try {
    const r = await fetch(`http://localhost:${PORT}/api/weather?lat=${lat}&lon=${lon}`);
    weather = await r.json();
  } catch (e) {
    weather = { error: 'no weather' };
  }

  if (process.env.OPENAI_KEY) {
    // If you add OpenAI integration, you can implement calling OpenAI here.
    // For now we return a placeholder telling the server is ready.
    return res.json({ ok: true, note: 'OPENAI_KEY set but production call not implemented in demo', field: f, weather });
  }

  // Simulated recommendations
  const recommendations = {
    recommended_crops: [
      { crop: 'Maíz', sowing_window: 'Mar-Abr', notes: 'Riegos moderados, evitar siembra en suelos encharcados.' },
      { crop: 'Girasol', sowing_window: 'Abr-May', notes: 'Resistente a sequía, necesita buen drenaje.' },
    ],
    forecast_summary: weather?.source || 'no-weather',
  };

  res.json({ field: f, recommendations });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
