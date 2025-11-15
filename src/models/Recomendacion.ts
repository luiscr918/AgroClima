import type { Usuario } from "./Usuario";


export interface Recomendacion {
  id?: number; // opcional para creación
  mensaje: string;
  tipo: string;
  fechaGeneracion: string; // se maneja como string en formato 'yyyy-MM-dd'
  usuario?: Usuario; // referencia al Usuario padre
}
