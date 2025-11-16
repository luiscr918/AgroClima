import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { UsuarioService } from "../../services/usuarioService";
import type { Usuario } from "../../models/Usuario";
import { SidebarAgricultor } from "../../components/SidebarAgricultor";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cloud } from "lucide-react";
import Swal from "sweetalert2";

export const ProfileAgricultor = () => {
  const { usuario, logout } = useAuth();

  const [usuarioCompleto, setUsuarioCompleto] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        if (usuario?.id) {
          const data = await UsuarioService.getUsuarioById(usuario.id);
          setUsuarioCompleto(data);
          setFormData(data);
        }
      } catch (error) {
        console.error("Error cargando el usuario", error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [usuario?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validarEmail = (email: string) => {
    const regex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  };

  const handleGuardar = async () => {
    if (!formData) return;

    // Validar email
    if (!validarEmail(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "El correo debe tener un formato correcto.",
      });
      return;
    }

    try {
      const res = await UsuarioService.updateUsuario(formData.id!, formData);

      setUsuarioCompleto(res);
      setEditing(false);

      Swal.fire({
        icon: "success",
        title: "Cambios guardados",
        text: "El perfil se actualizó correctamente.",
        confirmButtonColor: "#16a34a",
      });
    } catch (error: any) {
      if (error.response?.status === 400 || error.response?.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Correo duplicado",
          text: "Este correo ya está registrado por otro usuario.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al guardar los cambios.",
        });
      }
    }
  };

  const handleCancelar = () => {
    setFormData(usuarioCompleto);
    setEditing(false);

    Swal.fire({
      icon: "info",
      title: "Edición cancelada",
      text: "Los cambios no fueron guardados.",
    });
  };

  const handleCerrarSesion = () => {
    logout();
    navigate("/iniciar-sesion");
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (!usuarioCompleto || !formData)
    return <p>No se pudieron cargar los datos.</p>;

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAgricultor
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        usuario={usuario}
        onCerrarSesion={handleCerrarSesion}
      />

      <main className="flex-1 overflow-auto">
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md sticky top-0 z-40"
        >
          <div className="px-6 py-4 flex items-center gap-3">
            <Cloud className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
          </div>
        </motion.header>

        <div className="flex justify-center items-start px-6 py-8 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-md rounded-lg p-6 max-w-2xl w-full"
          >
            <h2 className="text-2xl font-bold mb-4 text-green-700">
              Datos del Agricultor
            </h2>

            <div className="grid grid-cols-1 gap-4 text-gray-700">
              <div>
                <label className="font-semibold">Nombre:</label>
                {editing ? (
                  <input
                    className="w-full border p-2 rounded"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{usuarioCompleto.nombre}</p>
                )}
              </div>

              <div>
                <label className="font-semibold">Apellido:</label>
                {editing ? (
                  <input
                    className="w-full border p-2 rounded"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{usuarioCompleto.apellido}</p>
                )}
              </div>

              <div>
                <label className="font-semibold">Email:</label>
                {editing ? (
                  <input
                    className="w-full border p-2 rounded"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{usuarioCompleto.email}</p>
                )}
              </div>

              <div>
                <label className="font-semibold">Teléfono:</label>
                {editing ? (
                  <input
                    className="w-full border p-2 rounded"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{usuarioCompleto.telefono}</p>
                )}
              </div>

              <div>
                <label className="font-semibold">Rol:</label>
                <p className="text-gray-500">{usuarioCompleto.rol}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Editar
                </button>
              ) : (
                <>
                  <button
                    onClick={handleGuardar}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Guardar Cambios
                  </button>

                  <button
                    onClick={handleCancelar}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
