import { api } from "../api/api";
import type { Usuario } from "../models/Usuario";

export const UsuarioService = {
  // Obtener todos los usuarios
  getUsuarios: async (): Promise<Usuario[]> => {
    const { data } = await api.get<Usuario[]>("/usuarios");
    return data;
  },

  // Obtener un usuario por ID
  getUsuarioById: async (id: number): Promise<Usuario> => {
    const { data } = await api.get<Usuario>(`/usuarios/${id}`);
    return data;
  },

  // Actualizar un usuario existente
  updateUsuario: async (id: number, usuario: Usuario): Promise<Usuario> => {
    const { data } = await api.put<Usuario>(`/usuarios/${id}`, usuario);
    return data;
  },

  // Eliminar un usuario
  deleteUsuario: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },
};
