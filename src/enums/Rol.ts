export const Rol = {
  ADMIN: 'ADMIN',
  AGRICULTOR: 'AGRICULTOR',
} as const;

export type Rol = typeof Rol[keyof typeof Rol];