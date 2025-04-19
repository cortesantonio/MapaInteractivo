

export interface Marcador {
  id: number;
  nombre_recinto: string;
  tipo_recinto: string;
  direccion: string;
  pagina_web: string;
  telefono: string;
  id_solicitud?: number;
  latitud?: number;
  longitud?: number;
  activo: boolean
}
