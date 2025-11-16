import { api } from "../api/api";
import type { Cultivo } from "../models/Cultivo"; // Asumiendo que existe un modelo Cultivo

export const CultivoService = {
  // Obtener todos los cultivos
  getCultivos: async (): Promise<Cultivo[]> => {
    const { data } = await api.get<Cultivo[]>("/cultivos");
    return data;
  },

  // Obtener un cultivo por ID
  getCultivoById: async (id: number): Promise<Cultivo> => {
    // El controlador devuelve Optional<Cultivo>, pero el servicio del cliente se mapea a Cultivo
    const { data } = await api.get<Cultivo>(`/cultivos/${id}`);
    return data;
  },

  // Guardar un nuevo cultivo
  createCultivo: async (cultivo: Cultivo): Promise<Cultivo> => {
    const { data } = await api.post<Cultivo>("/cultivos", cultivo);
    return data;
  },

  // Actualizar un cultivo
  updateCultivo: async (id: number, cultivo: Cultivo): Promise<Cultivo> => {
    const { data } = await api.put<Cultivo>(`/cultivos/${id}`, cultivo);
    return data;
  },

  // Eliminar un cultivo
  deleteCultivo: async (id: number): Promise<void> => {
    await api.delete(`/cultivos/${id}`);
  },

  // ⭐ Obtener cultivos por terreno (Implementado en el controlador)
  getCultivosByTerreno: async (terrenoId: number): Promise<Cultivo[]> => {
    const { data } = await api.get<Cultivo[]>(`/cultivos/terreno/${terrenoId}`);
    return data;
  },
};