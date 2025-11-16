import { api } from "../api/api";
import type { Siembra } from "../models/Siembra"; 

export const SiembraService = {
  // Obtener todas las siembras
  getSiembras: async (): Promise<Siembra[]> => {
    const { data } = await api.get<Siembra[]>("/siembras");
    return data;
  },

  // Obtener una siembra por ID
  getSiembraById: async (id: number): Promise<Siembra> => {
    // El controlador devuelve Optional<Siembra>, el cliente espera Siembra
    const { data } = await api.get<Siembra>(`/siembras/${id}`);
    return data;
  },

  // Guardar una nueva siembra
  createSiembra: async (siembra: Siembra): Promise<Siembra> => {
    const { data } = await api.post<Siembra>("/siembras", siembra);
    return data;
  },

  // Actualizar una siembra
  updateSiembra: async (id: number, siembra: Siembra): Promise<Siembra> => {
    const { data } = await api.put<Siembra>(`/siembras/${id}`, siembra);
    return data;
  },

  // Eliminar una siembra
  deleteSiembra: async (id: number): Promise<void> => {
    await api.delete(`/siembras/${id}`);
  },

  // ⭐ Obtener siembras por cultivo (Implementado en el controlador)
  getSiembrasByCultivo: async (cultivoId: number): Promise<Siembra[]> => {
    const { data } = await api.get<Siembra[]>(`/siembras/cultivo/${cultivoId}`);
    return data;
  },
};