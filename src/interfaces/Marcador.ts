import { Horario } from "./Horario";
import { Accesibilidad } from "./Accesibilidad";

export interface Marcador {
  id: number;
  id_solicitud?: number;
  nombre_recinto: string;
  tipo_recinto: string;
  direccion: string;
  pagina_web: string;
  telefono: string;
  latitud: number;
  longitud: number;
  activo: boolean;
  horario?: Horario[];
  accesibilidad?: Accesibilidad;
}
  