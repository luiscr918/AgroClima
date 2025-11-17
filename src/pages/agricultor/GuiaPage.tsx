import { motion } from "framer-motion";
import { Leaf, LogIn, MapPin, Bell, LineChart } from "lucide-react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

export default function GuiaPage() {
  const steps = [
    {
      number: 1,
      title: "Inicia sesión o regístrate",
      desc: "Crea tu cuenta o accede con tus credenciales para comenzar a usar AgroClima.",
      icon: LogIn,
      color: "bg-green-100 text-green-700",
    },
    {
      number: 2,
      title: "Registra tu Terreno",
      desc: "Ingresa la ubicación, extensión y cultivos que manejas para recibir recomendaciones personalizadas.",
      icon: MapPin,
      color: "bg-blue-100 text-blue-700",
    },
    {
      number: 3,
      title: "Consulta el clima y tus datos agrícolas",
      desc: "Revisa clima en tiempo real, pronósticos, humedad del suelo y datos históricos para tomar decisiones informadas.",
      icon: LineChart,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      number: 4,
      title: "Activa alertas y notificaciones",
      desc: "Recibe avisos tempranos de heladas, sequías, tormentas intensas y riesgos para tus cultivos.",
      icon: Bell,
      color: "bg-red-100 text-red-700",
    },
    {
      number: 5,
      title: "Aprovecha la inteligencia artificial",
      desc: "Obtén recomendaciones sobre riego, siembra, fertilización y manejo sostenible basadas en tus cultivos y clima.",
      icon: Leaf,
      color: "bg-green-200 text-green-800",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-100 to-green-200 text-gray-800">
      <NavBar />

      <main className="grow">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center text-green-800 mt-12 mb-6"
        >
          Guía para usar AgroClima
        </motion.h2>

        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-12 text-lg">
          Sigue estos pasos para aprovechar todas las herramientas que AgroClima
          ofrece a los agricultores para gestionar sus cultivos y adaptarse al
          cambio climático.
        </p>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 pb-20">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="relative bg-white border border-green-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
            >
              {/* Número */}
              <div className="absolute -top-4 -left-4 bg-green-700 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg text-lg font-bold">
                {step.number}
              </div>

              {/* Icono */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${step.color} shadow`}
              >
                <step.icon size={28} />
              </div>

              {/* Titulo */}
              <h3 className="text-2xl font-semibold text-green-800 mb-2">
                {step.title}
              </h3>

              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
