import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white/60 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-green-800">AgroClima</Link>

        {/* Desktop nav */}
        <nav aria-label="Principal" className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-green-700 hover:underline focus:outline-none focus:ring-2 focus:ring-green-300 rounded">Inicio</Link>
          <Link to="/#features" className="text-green-700 hover:underline focus:outline-none focus:ring-2 focus:ring-green-300 rounded">Funciones</Link>
          <Link to="/" className="text-green-700 hover:underline focus:outline-none focus:ring-2 focus:ring-green-300 rounded">Contacto</Link>
          <Link to="/iniciar-sesion" className="ml-2 px-4 py-2 bg-green-700 text-white rounded-md text-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-300">Iniciar sesión</Link>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            aria-controls="mobile-menu"
            aria-expanded={open}
            className="p-2 rounded-md text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <span className="sr-only">Abrir menú</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div id="mobile-menu" className={`md:hidden px-6 pb-4 ${open ? 'block' : 'hidden'}`}>
        <nav aria-label="Menú móvil" className="flex flex-col gap-2">
          <Link to="/" className="block py-2 text-green-700 hover:bg-green-50 rounded px-2">Inicio</Link>
          <Link to="/#features" className="block py-2 text-green-700 hover:bg-green-50 rounded px-2">Funciones</Link>
          <Link to="/" className="block py-2 text-green-700 hover:bg-green-50 rounded px-2">Contacto</Link>
          <Link to="/iniciar-sesion" onClick={() => setOpen(false)} className="mt-2 block w-full text-left py-2 bg-green-700 text-white rounded px-2">Iniciar sesión</Link>
        </nav>
      </div>
    </header>
  );
}
