import { Usuarios } from "./Usuarios";

export interface Discapacidad {
  id: number;
  id_usuarios: Usuarios;            // FK
  nombre: string;
  tipo: string;
}
