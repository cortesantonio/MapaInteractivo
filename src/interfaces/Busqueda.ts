import { Usuarios } from "./Usuario";
import { Marcador } from "./Marcador";

export interface Busqueda {
  id: number;
  idUsuarios?: Usuarios;            // FK
  idMarcador?: Marcador;          // FK
  fechaHora: Date;
}
