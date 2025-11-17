import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function ContactoPage() {
  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const contactos = [
    {
      icon: Mail,
      title: "Correo electrónico",
      desc: "Escríbenos para soporte, dudas o sugerencias.",
      info: "soporte@agroclima.com",
    },
    {
      icon: Phone,
      title: "Teléfono",
      desc: "Atención de lunes a viernes de 8 a 18h.",
      info: "+593 99 123 4567",
    },
    {
      icon: MapPin,
      title: "Ubicación",
      desc: "Oficina central.",
      info: "Quito, Ecuador",
    },
    {
      icon: MessageSquare,
      title: "Chat de Soporte",
      desc: "Resolvemos tus dudas rápidamente.",
      info: "Disponible dentro de la app",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100">
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* TÍTULO */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold text-green-800 text-center mb-8"
        >
          Contacto
        </motion.h1>

        {/* SUBTÍTULO */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-700 text-lg max-w-2xl mx-auto mb-16"
        >
          Estamos aquí para ayudarte. Puedes comunicarte con nosotros a través de cualquiera
          de los siguientes canales. Nuestro equipo responderá con la mayor rapidez posible.
        </motion.p>

        {/* GRID DE CONTACTO */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactos.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-green-200 cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="flex items-center justify-center mb-4">
                <item.icon className="w-12 h-12 text-green-700" />
              </div>

              <h3 className="text-xl font-semibold text-green-800 text-center mb-2">
                {item.title}
              </h3>

              <p className="text-center text-gray-600 text-sm mb-3">
                {item.desc}
              </p>

              <p className="text-center font-medium text-green-700">{item.info}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA FINAL */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 bg-green-700 text-white p-10 rounded-3xl shadow-xl text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitas ayuda personalizada?
          </h2>
          <p className="opacity-90 mb-3">
            Nuestro equipo está comprometido con brindarte el mejor soporte.
          </p>
          <p className="font-semibold tracking-wide text-green-100">
            soporte@agroclima.com
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
