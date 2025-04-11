import { Tipo_Recinto } from "./Tipo_Recinto";

export interface Solicitudes {
    id: number;
    nombre_locacion: string;
    direccion: string;
    tipo_recinto: Tipo_Recinto;  // FK
    documentacion: string;
    estado: string;
    fecha_ingreso: Date;
    respuesta_rechazo: string;
    fecha_revision: Date;
    porcentaje_pcd: number;
    cumple_ley_21015: boolean;
    cumple_ley_20422: boolean;
    accesibilidad_certificada: boolean;
  };
