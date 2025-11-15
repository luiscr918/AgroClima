import type { Siembra } from "./Siembra";
import type { Terreno } from "./Terreno";



export interface Cultivo {
  id?: number; // opcional para creación
  nombre: string;
  tipo: string;
  cicloDias: number;
  temporadaOptima: string;
  terreno?: Terreno; // referencia al Terreno padre
  siembras?: Siembra[]; // relación con Siembras
}
