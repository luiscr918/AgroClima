import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';


export default function IniciarSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      // Simulación de autenticación
      if (email && password.length >= 6) {
        // Guardar en localStorage (para demo)
        localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
        setTimeout(() => {
          navigate('/');
        }, 800);
      } else {
        setError('Email o contraseña inválidos');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-green-50 to-green-100">
      <NavBar />

      <main className="grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Card principal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-green-800">AgroClima</h1>
              <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Botón Iniciar Sesión */}
              <button
                type="submit"
                disabled={cargando}
                className="w-full mt-6 px-4 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 disabled:bg-gray-400 transition"
              >
                {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            {/* Links adicionales */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link to="/registro" className="text-green-700 hover:text-green-800 font-medium">
                  Regístrate aquí
                </Link>
              </p>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          {/* Demo info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>Para demo:</strong> Usa cualquier email y contraseña con 6+ caracteres
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
