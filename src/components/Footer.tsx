export default function Footer() {
  return (
    <footer aria-label="Footer" className="w-full bg-white/70 backdrop-blur-md mt-12 border-t border-green-200">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-green-800">
        <div className="space-y-3">
          <div className="text-2xl font-bold">AgroClima</div>
          <p className="text-sm text-gray-700">Herramientas para adaptación climática, alertas y buenas prácticas agrícolas.</p>
          <div className="flex items-center gap-3 mt-2">
            <a href="#" aria-label="Twitter" className="text-green-700 hover:text-green-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43 1s-1.79 1-2.9 1.22A4.48 4.48 0 0 0 16.5 0c-2.5 0-4.53 2.34-3.8 4.73A12.94 12.94 0 0 1 1.64 1.15 4.48 4.48 0 0 0 3.1 7.86 4.44 4.44 0 0 1 .88 7.5v.06A4.48 4.48 0 0 0 4.5 12a4.52 4.52 0 0 1-2 .08A4.48 4.48 0 0 0 6.29 15a9 9 0 0 1-5.56 1.92A12.66 12.66 0 0 0 8.29 20c7.73 0 11.95-6.42 11.95-11.98 0-.18 0-.35-.01-.53A8.6 8.6 0 0 0 23 3z"></path></svg>
            </a>
            <a href="#" aria-label="GitHub" className="text-green-700 hover:text-green-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.648.5.5 5.648.5 12c0 5.088 3.292 9.402 7.863 10.933.575.106.785-.25.785-.556 0-.274-.01-1.003-.015-1.967-3.2.696-3.876-1.543-3.876-1.543-.523-1.332-1.277-1.687-1.277-1.687-1.043-.713.079-.699.079-.699 1.154.081 1.761 1.186 1.761 1.186 1.025 1.756 2.688 1.249 3.343.955.103-.744.401-1.249.73-1.536-2.555-.292-5.243-1.277-5.243-5.682 0-1.255.448-2.28 1.182-3.085-.118-.293-.512-1.474.112-3.073 0 0 .964-.31 3.158 1.176a10.93 10.93 0 0 1 2.876-.387c.976.004 1.96.132 2.876.387 2.193-1.486 3.156-1.176 3.156-1.176.627 1.6.234 2.78.116 3.073.737.805 1.181 1.83 1.181 3.085 0 4.417-2.693 5.387-5.257 5.672.413.355.781 1.056.781 2.128 0 1.536-.014 2.774-.014 3.153 0 .31.207.668.79.555C20.71 21.395 24 17.082 24 12 24 5.648 18.352.5 12 .5z"></path></svg>
            </a>
          </div>
        </div>

        <div className="flex gap-8 md:gap-12">
          <div>
            <h4 className="text-sm font-semibold text-green-800 mb-3">Enlaces</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><a href="#" className="hover:underline">Inicio</a></li>
              <li><a href="#features" className="hover:underline">Funciones</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-green-800 mb-3">Contacto</h4>
            <p className="text-sm text-gray-700">soporte@agroclima.example</p>
            <p className="text-sm text-gray-700">+34 600 000 000</p>
          </div>
        </div>

        <div className="md:col-span-3 lg:col-span-1">
          <h4 className="text-sm font-semibold text-green-800 mb-3">Suscríbete</h4>
          <form onSubmit={(e) => { e.preventDefault(); alert('Suscripción simulada'); }} className="flex gap-2">
            <label htmlFor="footer-email" className="sr-only">Correo</label>
            <input id="footer-email" type="email" required placeholder="tu@correo.com" className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-green-300" />
            <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-md">Enviar</button>
          </form>
        </div>

        <div className="md:col-span-3 text-center mt-6 text-sm text-gray-600">
          © {new Date().getFullYear()} AgroClima — Herramientas para adaptación climática.
        </div>
      </div>
    </footer>
  );
}
