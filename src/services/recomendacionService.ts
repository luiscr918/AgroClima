import { api } from "../api/api";
import type { Recomendacion } from "../models/Recomendacion"; // Asumiendo que existe un modelo Recomendacion

export const RecomendacionService = {
  // Obtener todas las recomendaciones
  getRecomendaciones: async (): Promise<Recomendacion[]> => {
    const { data } = await api.get<Recomendacion[]>("/recomendaciones");
    return data;
  },

  // Obtener una recomendación por ID
  getRecomendacionById: async (id: number): Promise<Recomendacion> => {
    // El controlador devuelve Optional<Recomendacion>, el cliente espera Recomendacion
    const { data } = await api.get<Recomendacion>(`/recomendaciones/${id}`);
    return data;
  },

  // Guardar una nueva recomendación
  createRecomendacion: async (
    recomendacion: Recomendacion
  ): Promise<Recomendacion> => {
    const { data } = await api.post<Recomendacion>("/recomendaciones", recomendacion);
    return data;
  },

  // Actualizar una recomendación
  updateRecomendacion: async (
    id: number,
    recomendacion: Recomendacion
  ): Promise<Recomendacion> => {
    const { data } = await api.put<Recomendacion>(
      `/recomendaciones/${id}`,
      recomendacion
    );
    return data;
  },

  // Eliminar una recomendación
  deleteRecomendacion: async (id: number): Promise<void> => {
    await api.delete(`/recomendaciones/${id}`);
  },

  // ⭐ Obtener recomendaciones por usuario
  getRecomendacionesByUsuario: async (
    usuarioId: number
  ): Promise<Recomendacion[]> => {
    const { data } = await api.get<Recomendacion[]>(
      `/recomendaciones/usuario/${usuarioId}`
    );
    return data;
  },
};