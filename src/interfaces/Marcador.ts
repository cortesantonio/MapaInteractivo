import { Horarios } from "./Horario";
import { Accesibilidad } from "./Accesibilidad";

export interface Marcador {
  id: number;
  nombre: string;
  tipo: string;
  calificacion_comunidad: number;
  calificacion_google: number;
  direccion: string;
  pag_web: string;
  telefono: string;
  horarios?: Horarios[];
  accesibilidad?: Accesibilidad;
}
  