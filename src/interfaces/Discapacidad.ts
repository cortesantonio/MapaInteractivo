import { Usuarios } from "./Usuario";

export interface Discapacidad {
    id: number;
    idUsuarios: Usuarios;            // FK
    nombre: string;
    tipoDiscapacidad: string;
  }
  