import type { Rol } from "../enums/Rol";

export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    email: string;
    rol: Rol;
  };
}