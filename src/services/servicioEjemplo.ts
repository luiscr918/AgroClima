import { api } from "../api/api";
import type { Videojuego } from "../models/Videojuego";

export const VideojuegoService = {
  // Obtener todos los videojuegos
  getVideojuegos: async (): Promise<Videojuego[]> => {
    const { data } = await api.get<Videojuego[]>("/videojuegos");
    return data;
  },

  // Obtener un videojuego por ID
  getVideojuegoById: async (id: string): Promise<Videojuego> => {
    const { data } = await api.get<Videojuego>(`/videojuegos/${id}`);
    return data;
  },

  // Crear un nuevo videojuego
  createVideojuego: async (videojuego: Videojuego): Promise<Videojuego> => {
    const { data } = await api.post<Videojuego>("/videojuegos", videojuego);
    return data;
  },

  // Actualizar un videojuego existente
  updateVideojuego: async (id: string, videojuego: Videojuego): Promise<Videojuego> => {
    const { data } = await api.put<Videojuego>(`/videojuegos/${id}`, videojuego);
    return data;
  },

  // Eliminar un videojuego
  deleteVideojuego: async (id: string): Promise<void> => {
    await api.delete(`/videojuegos/${id}`);
  },

  // Buscar videojuegos por género
  getVideojuegosPorGenero: async (genero: string): Promise<Videojuego[]> => {
    const { data } = await api.get<Videojuego[]>(`/videojuegos/genero/${genero}`);
    return data;
  },

  // Buscar videojuegos por plataforma
  getVideojuegosPorPlataforma: async (plataforma: string): Promise<Videojuego[]> => {
    const { data } = await api.get<Videojuego[]>(`/videojuegos/plataforma/${plataforma}`);
    return data;
  },
};
