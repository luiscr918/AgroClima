import type { EstadoS } from "../enums/EstadoS";
import type { Cultivo } from "./Cultivo";


export interface Siembra {
  id?: number; // opcional para creación
  fechaSiembra: string; // se maneja como string en formato 'yyyy-MM-dd'
  estado: EstadoS;
  cultivo?: Cultivo; // referencia al Cultivo padre
}
