import type { Siembra } from "./Siembra";
import type { Terreno } from "./Terreno";



export interface Cultivo {
  id?: number; // opcional para creación
  nombre: string;
  tipo: string;
  cicloDias: number;
  temporadaOptima: string;
  terreno?: Partial<Terreno>; // referencia al Terreno padre
  siembras?: Siembra[]; // relación con Siembras
    // 🔥 Agregamos la propiedad transitoria del JSON
  terrenoId?: number; // <- AQUÍ ESTÁ LA SOLUCIÓN
}
