import { Usuarios } from "./Usuarios";
import { Marcador } from "./Marcador";

export interface Busquedas {
  id: number;
  id_usuario?: Usuarios;            // FK
  id_marcador?: Marcador;          // FK
  fecha_hora: Date;
}
