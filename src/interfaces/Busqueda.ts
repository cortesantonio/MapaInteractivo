import { Usuarios } from "./Usuarios";
import { Marcador } from "./Marcador";

export interface Busqueda {
  id: number;
  id_usuarios?: Usuarios;            // FK
  id_marcador?: Marcador;          // FK
  fecha_hora: Date;
}
