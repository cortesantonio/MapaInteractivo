import { Usuarios } from "./Usuarios";
import { Marcador } from "./Marcador";

export interface Resenas {
  id: number;
  id_marcador: Marcador;       // FK
  id_usuario: Usuarios;         // FK
  fecha: Date;
  calificacion: number;
  comentario: string;
}
