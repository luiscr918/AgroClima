// src/context/AuthContext.ts
import { createContext } from "react";
import type { AuthResponse } from "../models/AuthResponse";
import type { AuthRequest } from "../models/AuthRequest";

export interface AuthContextType {
  usuario: AuthResponse["usuario"] | null;
  token: string | null;
  login: (data: AuthRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
