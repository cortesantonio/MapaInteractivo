import { Usuarios } from "./Usuarios";

export interface Discapacidad {
  id: number;
  id_usuario: Usuarios;            // FK
  nombre: string;
  tipo: string;
}
