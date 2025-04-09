import { Usuarios } from "./Usuario";
import { Marcador } from "./Marcador";

export interface Resena {
  id: number;
  idMarcador: Marcador;       // FK
  idUsuarios: Usuarios;         // FK
  fecha: Date;
  calificacion: number;
  comentario: string;
}
