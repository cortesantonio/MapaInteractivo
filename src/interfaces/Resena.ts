import { Usuarios } from "./Usuarios";
import { Marcador } from "./Marcador";

export interface Resena {
  id: number;
  id_marcador: Marcador;       // FK
  id_usuarios: Usuarios;         // FK
  fecha: Date;
  calificacion: number;
  comentario: string;
}
