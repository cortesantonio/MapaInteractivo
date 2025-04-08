
export interface Marcador {
    
    nombre: string;
    tipo: string;
    calificacion_comunidad: number;
    calificacion_google: number;
    direccion: string;
    pag_web: string;
    telefono: string;
    horarios: {
      lunes: string;
      martes: string;
      miércoles: string;
    };
    accesibilidad: {
      arquitectonica: string[];
      sensorial: string[];
      cognitiva: string[];
    };
  }
  