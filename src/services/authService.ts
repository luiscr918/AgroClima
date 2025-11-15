// src/services/AuthService.ts
import { api } from "../api/api";
import type { AuthRequest } from "../models/AuthRequest";
import type { AuthResponse } from "../models/AuthResponse";
import type { Usuario } from "../models/Usuario";

export const authService = {
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);
    return data;
  },

  register: async (registro: Usuario): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>(
      "/auth/register",
      registro
    );
    return data;
  },
};
