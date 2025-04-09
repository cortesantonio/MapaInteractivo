import { TipoRecinto } from "./TipoRecinto";

export interface Solicitud {
    id: number;
    nombreLocacion: string;
    direccion: string;
    tipoRecinto: TipoRecinto;  // FK
    documentacion: string;
    estado: string;
    fechaIngreso: Date;
    respuestaRechazo: string;
    fechaRevision: Date;
    porcentajePcd: number;
    cumpleLey21015: boolean;
    cumpleLey20422: boolean;
    accesibilidadCertificada: boolean;
  };
