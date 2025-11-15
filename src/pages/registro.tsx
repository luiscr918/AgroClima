import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';


export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  // Calcular fuerza de contraseña
  function getPasswordStrength(pwd: string) {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 1;
    if (/\d/.test(pwd)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;
    return strength;
  }

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['Muy débil', 'Débil', 'Medio', 'Fuerte', 'Muy fuerte'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setCargando(true);

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setCargando(false);
      return;
    }

    if (passwordStrength < 2) {
      setError('La contraseña es muy débil');
      setCargando(false);
      return;
    }

    if (!aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones');
      setCargando(false);
      return;
    }

    try {
      // Simulación de registro
      if (nombre && email && password.length >= 6) {
        localStorage.setItem('user', JSON.stringify({ email, nombre }));
        setExito(true);
        setTimeout(() => {
          navigate('/iniciar-sesion');
        }, 2000);
      } else {
        setError('Completa todos los campos correctamente');
      }
    } catch (err) {
      setError('Error al registrarse. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  if (exito) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-b from-green-50 to-green-100">
        <NavBar />
        <main className="grow flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-700" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">¡Registro exitoso!</h2>
              <p className="text-gray-600 mb-4">
                Tu cuenta ha sido creada. Redirigiendo a iniciar sesión...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto"></div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
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
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-green-800">Crear Cuenta</h1>
              <p className="text-gray-600 mt-2">Únete a AgroClima hoy</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

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

              {/* Contraseña */}
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

                {/* Indicador de fuerza */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${
                            i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      Fuerza: <span className="font-medium">{strengthLabels[passwordStrength]}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>
                {confirmPassword && password === confirmPassword && (
                  <p className="text-xs text-green-600 mt-1">✓ Las contraseñas coinciden</p>
                )}
              </div>

              {/* Términos */}
              <div className="flex items-start gap-2 mt-4">
                <input
                  type="checkbox"
                  id="terminos"
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-green-700 cursor-pointer"
                />
                <label htmlFor="terminos" className="text-xs text-gray-600 cursor-pointer">
                  Acepto los{' '}
                  <button type="button" className="text-green-700 hover:text-green-800 underline">
                    términos y condiciones
                  </button>
                </label>
              </div>

              {/* Botón registrarse */}
              <button
                type="submit"
                disabled={cargando}
                className="w-full mt-6 px-4 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 disabled:bg-gray-400 transition"
              >
                {cargando ? 'Registrando...' : 'Crear Cuenta'}
              </button>
            </form>

            {/* Link a iniciar sesión */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link to="/iniciar-sesion" className="text-green-700 hover:text-green-800 font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
