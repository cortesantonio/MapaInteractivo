import { Usuarios } from "./Usuarios";
export interface Solicitudes {
  id: number;
  id_usuario?: Usuarios;
  nombre_locacion: string;
  descripcion: string;
  direccion: string;
  tipo_recinto: number
  documentacion: string;
  estado: string;
  fecha_ingreso: Date;
  respuesta_rechazo: string;
  fecha_revision: Date;
  cumple_ley_21015: boolean;
  accesibilidad_certificada: boolean;
  latitud?: number;
  longitud?: number;
};
