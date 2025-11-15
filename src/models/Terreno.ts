import type { Cultivo } from './Cultivo';
import type { Pronostico } from './Pronostico';
import type { Usuario } from './Usuario';

export interface Terreno {
  id?: number; // opcional para creación
  nombre: string;
  tamanioHectareas: number; // BigDecimal se maneja como number en JS/TS
  ubicacion: string;
  tipoSuelo: string;
  usuario?: Usuario; // referencia al usuario propietario
  cultivos?: Cultivo[]; // relación con Cultivos
  pronosticos?: Pronostico[]; // relación con Pronosticos
}
