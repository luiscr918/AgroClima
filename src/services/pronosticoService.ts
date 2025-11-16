import { api } from "../api/api";
import type { Pronostico } from "../models/Pronostico"; // Asumiendo que existe un modelo Pronostico

export const PronosticoService = {
  // Obtener todos los pronósticos
  getPronosticos: async (): Promise<Pronostico[]> => {
    const { data } = await api.get<Pronostico[]>("/pronosticos");
    return data;
  },

  // Obtener un pronóstico por ID
  getPronosticoById: async (id: number): Promise<Pronostico> => {
    // El controlador devuelve Optional<Pronostico>, el cliente espera Pronostico
    const { data } = await api.get<Pronostico>(`/pronosticos/${id}`);
    return data;
  },

  // Guardar un nuevo pronóstico
  createPronostico: async (pronostico: Pronostico): Promise<Pronostico> => {
    const { data } = await api.post<Pronostico>("/pronosticos", pronostico);
    return data;
  },

  // Actualizar un pronóstico
  updatePronostico: async (
    id: number,
    pronostico: Pronostico
  ): Promise<Pronostico> => {
    const { data } = await api.put<Pronostico>(`/pronosticos/${id}`, pronostico);
    return data;
  },

  // Eliminar un pronóstico
  deletePronostico: async (id: number): Promise<void> => {
    await api.delete(`/pronosticos/${id}`);
  },

  // ⭐ Obtener pronósticos por terreno (NUEVO ENDPOINT)
  getPronosticosByTerreno: async (terrenoId: number): Promise<Pronostico[]> => {
    const { data } = await api.get<Pronostico[]>(
      `/pronosticos/terreno/${terrenoId}`
    );
    return data;
  },
};