export const EstadoS = {
    PLANIFICADO:'PLANIFICADO',
    ACTIVA:'ACTIVA',
    COSECHADA:'COSECHADA'
  // agrega otros estados si los hay
} as const;

export type EstadoS = typeof EstadoS[keyof typeof EstadoS];
