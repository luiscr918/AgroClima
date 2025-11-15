import type { Terreno } from "./Terreno";


export interface Pronostico {
  id?: number; // opcional para creación
  fecha: string; // se maneja como string en formato 'yyyy-MM-dd'
  temperaturaMinima: number; // BigDecimal mapeado a number
  temperaturaMaxima: number; // BigDecimal mapeado a number
  precipitacion: number; // BigDecimal mapeado a number
  humedad: number; // BigDecimal mapeado a number
  descripcion: string;
  terreno?: Terreno; // referencia al Terreno padre
}
