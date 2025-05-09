

export interface Marcador {
  id: number;
  id_usuario: number;
  nombre_recinto: string;
  tipo_recinto: string;
  direccion: string;
  pagina_web: string;
  telefono: string;
  url_img: string;
  id_solicitud?: number;
  latitud?: number;
  longitud?: number;
  activo: boolean
}
