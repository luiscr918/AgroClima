
import type { Rol } from '../enums/Rol';
import type { Recomendacion } from './Recomendacion';
import type { Terreno } from './Terreno';

export interface Usuario {
  id?: number; // opcional para creación
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  rol?: Rol;
  terrenos?: Terreno[];
  recomendaciones?: Recomendacion[];
}
