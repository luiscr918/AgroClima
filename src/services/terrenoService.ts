import { api } from "../api/api";
import type { Terreno } from "../models/Terreno";

export const TerrenoService = {
  // Obtener todos los terrenos
  getTerrenos: async (): Promise<Terreno[]> => {
    const { data } = await api.get<Terreno[]>("/terrenos");
    return data;
  },

  // Obtener un terreno por ID
  getTerrenoById: async (id: number): Promise<Terreno> => {
    const { data } = await api.get<Terreno>(`/terrenos/${id}`);
    return data;
  },

  // Guardar un nuevo terreno
  createTerreno: async (terreno: Terreno): Promise<Terreno> => {
    const { data } = await api.post<Terreno>("/terrenos", terreno);
    return data;
  },

  // Actualizar un terreno
  updateTerreno: async (id: number, terreno: Terreno): Promise<Terreno> => {
    const { data } = await api.put<Terreno>(`/terrenos/${id}`, terreno);
    return data;
  },

  // Eliminar un terreno
  deleteTerreno: async (id: number): Promise<void> => {
    await api.delete(`/terrenos/${id}`);
  },

  // ⭐ obtener terrenos por usuario
  getTerrenosByUsuario: async (usuarioId: number): Promise<Terreno[]> => {
    const { data } = await api.get<Terreno[]>(`/terrenos/usuario/${usuarioId}`);
    return data;
  },
};
