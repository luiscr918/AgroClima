import { api } from "../api/api";

export const IaService = {
  generarRecomendacionesIA: async (prompt: string): Promise<string> => {
    const { data } = await api.post("/api/recomendacionesIA", { prompt });
    return data.resultado; // El backend devuelve { resultado: "texto" }
  },
};
