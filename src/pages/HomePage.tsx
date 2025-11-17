import { motion } from "framer-motion";
import { Sun, CloudRain, Leaf } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function FeatureCard({
  title,
  desc,
  icon: Icon,
  color,
}: {
  title: string;
  desc: string;
  icon: any;
  color?: string;
}) {
  return (
    <motion.article
      whileHover={{ translateY: -6 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-green-100"
      role="article"
      aria-labelledby={`feature-${title.replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center gap-4 mb-3">
        <div className={`p-3 rounded-lg ${color ?? "bg-green-50"}`}>
          <Icon className="w-7 h-7 text-current" />
        </div>
        <h3
          id={`feature-${title.replace(/\s+/g, "-")}`}
          className="text-xl font-semibold text-green-800"
        >
          {title}
        </h3>
      </div>
      <p className="text-sm text-gray-700">{desc}</p>
    </motion.article>
  );
}

export function HomePage() {
  const [location, setLocation] = useState("");
  const [stats] = useState([
    { label: "Estaciones conectadas", value: "12" },
    { label: "Alertas activas", value: "3" },
    { label: "Usuarios", value: "1.2k" },
    { label: "Regiones monitorizadas", value: "24" },
  ]);

  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  function StatCard({ label, value }: { label: string; value: string }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="text-2xl font-bold text-green-800">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    );
  }

  function Testimonial({ quote, by }: { quote: string; by: string }) {
    return (
      <blockquote className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-700">“{quote}”</p>
        <footer className="mt-3 text-sm text-gray-500">— {by}</footer>
      </blockquote>
    );
  }

  function FaqItem({ i, q, a }: { i: number; q: string; a: string }) {
    const open = faqOpen === i;
    return (
      <div className="border-b">
        <button
          className="w-full text-left py-3 flex items-center justify-between"
          onClick={() => setFaqOpen(open ? null : i)}
          aria-expanded={open}
        >
          <span className="font-medium text-green-800">{q}</span>
          <span className="text-green-600">{open ? "−" : "+"}</span>
        </button>
        {open && <div className="py-2 text-sm text-gray-700">{a}</div>}
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-green-100 to-green-300 text-gray-800">
      <NavBar />

      <main className="grow">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-60"
            aria-hidden="true"
          />
          <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl leading-tight">
                  AgroClima
                </h1>
                <p className="mt-4 max-w-xl text-lg text-black drop-shadow-md">
                  Herramienta digital para agricultores que permite registrar
                  terrenos, monitorear cultivos, recibir pronósticos
                  personalizados y acceder a recomendaciones inteligentes para
                  enfrentar los desafíos del clima.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/dashboard/agricultor"
                    className="inline-flex items-center px-5 py-3 bg-green-800 text-white rounded-lg font-medium shadow hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Comenzar ahora
                  </Link>
                  <Link
                    to="/guia"
                    className="inline-flex items-center px-4 py-3 bg-white text-green-800 font-medium rounded-lg shadow hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Ver Guía
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="rounded-xl bg-white/80 p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">
                        Última lectura
                      </div>
                      <div className="text-3xl font-bold">22°C</div>
                      <div className="text-sm text-gray-600">
                        Humedad 58% · Viento 12 km/h
                      </div>
                    </div>
                    <div className="text-green-700 text-4xl">
                      <Sun className="w-10 h-10" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-600">
                    Datos de ejemplo. Conecta tu estación meteorológica para
                    datos en tiempo real.
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="max-w-6xl mx-auto px-6 py-16 relative"
        >
          {/* Burbujas decorativas */}
          <div className="absolute top-0 left-10 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute bottom-0 right-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-extrabold text-center text-green-800 mb-12 drop-shadow-sm"
          >
            Herramientas que transforman tu campo
          </motion.h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                title: "Clima preciso por terreno",
                desc: "Consulta datos exactos para tu Terreno: lluvia, viento, humedad y más.",
                icon: Sun,
                color: "text-yellow-600 bg-yellow-100",
              },
              {
                title: "Alertas de riesgo agrícola",
                desc: "Heladas, tormentas, sequías y cambios bruscos… enterate antes que pase.",
                icon: CloudRain,
                color: "text-blue-600 bg-blue-100",
              },
              {
                title: "Recomendaciones sostenibles",
                desc: "IA que analiza tu cultivo y sugiere prácticas eficientes y ecológicas.",
                icon: Leaf,
                color: "text-green-600 bg-green-100",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.07 }}
                className="rounded-2xl p-[1px] bg-gradient-to-br from-green-300 to-green-600 shadow-lg hover:shadow-xl"
              >
                <div className="bg-white rounded-2xl p-6 h-full flex flex-col gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${f.color} shadow-md`}
                  >
                    <f.icon size={28} />
                  </div>

                  <h3 className="text-xl font-semibold text-green-800">
                    {f.title}
                  </h3>
                  <p className="text-gray-600">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-10">
            Preguntas frecuentes
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "¿Qué puedo hacer en AgroClima?",
                a: "Puedes registrar terrenos, gestionar siembras y cosechas, visualizar tu información agrícola en un solo panel y recibir análisis personalizados basados en clima.",
              },
              {
                q: "¿Cómo funciona la inteligencia artificial en mis cultivos?",
                a: "La IA analiza clima, historial de tus terrenos y patrones agrícolas para generar recomendaciones personalizadas, incluyendo riego, fertilización, fechas óptimas de siembra y alertas tempranas.",
              },
              {
                q: "¿Qué necesito para usar AgroClima?",
                a: "Solo registrarte, añadir tu terreno, indicar qué cultivos manejas y automáticamente comenzarás a recibir información adaptada a tu contexto.",
              },
              {
                q: "¿Puedo ver datos históricos o pronósticos?",
                a: "Sí. AgroClima ofrece pronósticos, clima en tiempo real y datos históricos que pueden ayudarte a planificar tus próximas actividades agrícolas.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white p-6 rounded-xl shadow-md border border-green-200 cursor-pointer hover:shadow-xl transition-all"
              >
                <details className="group">
                  <summary className="flex justify-between items-center font-medium text-green-800 cursor-pointer">
                    <span>{item.q}</span>
                    <span className="text-green-600 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>

                  <p className="mt-3 text-gray-700 text-sm">{item.a}</p>
                </details>
              </motion.div>
            ))}
          </div>
        </section>

        {/* NEWSLETTER CTA */}
        <section className="bg-green-50 py-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold text-green-800">
              Recibe alertas y novedades
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Suscríbete para recibir notificaciones y recursos para tu
              explotación.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscripción simulada");
              }}
              className="mt-4 flex max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="tu@correo.com"
                required
                className="flex-1 rounded-l-md border border-gray-200 px-3 py-2"
              />
              <button className="px-4 py-2 bg-green-700 text-white rounded-r-md">
                Suscribirme
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
